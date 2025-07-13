"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Registerpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(password != confirmPassword){
      alert("Password do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        }),
      })

      const data = await res.json();
      if(!res.ok){
        throw new Error(data.error || "Regsitration failed")
      }

      console.log(data);
      router.push("/login")

    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="email"
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input 
          type="password"
          placeholder='confirm Password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type='submit'>Register</button>
      </form>
      <div>
        <p>Already have an account? </p> <button onClick={() => router.push("/login")}>Login</button>
      </div>
    </div>
  )
}

export default Registerpage
