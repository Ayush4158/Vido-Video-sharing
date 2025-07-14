"use client";

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useState } from "react";

interface FileUploadProps {
    onSucess: (res: any) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
}

const FileUpload = ({ onSucess, onProgress, fileType }: FileUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File) => {
        if (fileType === 'video' && !file.type.startsWith("video/")) {
            setError("Please upload a valid video file");
            return false;
        }

        if (file.size > 100 * 1024 * 1024) {
            setError("File size must be less than 100 MB");
            return false;
        }

        return true;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !validateFile(file)) return;

        setUploading(true);
        setError(null);

        try {
            const authRes = await fetch("/api/auth/imagekit-auth");
            const auth = await authRes.json();

            const res = await upload({
                file,
                fileName: file.name,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature: auth.signature,
                expire: auth.expire,
                token: auth.token,
                onProgress: (event: any) => {
                    if (event.lengthComputable && onProgress) {
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent));
                    }
                },
            });

            onSucess(res);
        } catch (error) {
            if (error instanceof ImageKitInvalidRequestError) {
                setError("Invalid upload request.");
            } else if (error instanceof ImageKitUploadNetworkError) {
                setError("Network error while uploading.");
            } else if (error instanceof ImageKitServerError) {
                setError("Server error from ImageKit.");
            } else if (error instanceof ImageKitAbortError) {
                setError("Upload was aborted.");
            } else {
                setError("Something went wrong during upload.");
            }
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <input
                type="file"
                accept={fileType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
            />
            {uploading && <span>Uploading...</span>}
            {error && <p className="text-red-500">{error}</p>}
        </>
    );
};

export default FileUpload;
