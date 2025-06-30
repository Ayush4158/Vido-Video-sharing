import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest){
  try {
    const {email, password} = await request.json()

    if(!email || !password){
      return NextResponse.json(
        {
          error: "Email and Password are required"
        },
        {
          status: 400
        }
      )
    }

    await connectToDatabase()

    const existingUser = await User.findOne({email})
    if(existingUser){
      return NextResponse.json(
        {
          error: "User already registerd"
        },
        {
          status: 400
        }
      )
    }

    const user = await User.create({
      email,
      password
    })

    return NextResponse.json(
      user,
      {
        status: 200
      }
    )
  } catch (error) {
    console.error("Registration error" , error)
    return NextResponse.json(
      {
        error: "Failed to register user"
      },
      {
        status: 400
      }
    )
  }
}
