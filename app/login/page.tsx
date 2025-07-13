"use client"
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter()

  const handleSubmit = async( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault()

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    if(result?.error){
      console.log(result.error)
    }else{
      router.push("/")
    }
  }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit'>Login</button>
      </form>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
      <button onClick={() => signIn("github")}>Sign in with GitHub</button>

      <div>
        <p>Dont have an account</p> <button onClick={() => router.push('/regsiter')}>Register</button>
      </div>

    </div>
  )
}

export default Loginpage
