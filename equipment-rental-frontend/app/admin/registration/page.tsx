"use client";

import { useState } from "react";
import MyTitle from "@/components/title";
import { adminSchema } from "./schema";

export default function AdminRegistrationPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const result = adminSchema.safeParse({ 
      fullName, 
      email, 
      password, 
      phone, 
      adminSecret 
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    console.log("Admin Data:", result.data);
    alert("Admin Account Created Successfully!");
    
    setFullName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setAdminSecret("");
    setError("");
  };

  return (
    <>
      <MyTitle props={{ title: "Admin Registration" }} />
      
      <h1>Admin Registration Form</h1>
      
      <form onSubmit={handleSubmit}>
        <label>Admin Full Name</label> <br />
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} /> <br />

        <label>Admin Email</label> <br />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />

        <label>Password</label> <br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> <br />

        <label>Phone (11 Digits)</label> <br />
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} /> <br />

        <label>Admin Secret Code (6 digits)</label> <br />
        <input type="password" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} /> <br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <br />
        <button type="submit">Register Admin</button>
      </form>
    </>
  );
}