"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials. You are not the Sovereign.");
    } else {
      router.push("/sovereign-control");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-900">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sovereign-dark/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="glass-panel p-8 rounded-2xl w-full max-w-md relative z-10 border border-sovereign/30 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sovereign/10 rounded-full mx-auto flex items-center justify-center border border-sovereign/30 shadow-[0_0_15px_rgba(59,130,246,0.2)] mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sovereign Protocol</h1>
          <p className="text-gray-400 text-sm mt-1">Classified Entry</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wider">Clearance Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-sovereign/50 transition"
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1 uppercase tracking-wider">Passphrase</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-sovereign/50 transition"
              required 
            />
          </div>
          <button type="submit" className="w-full bg-sovereign hover:bg-sovereign-light text-white font-bold py-3 rounded-lg mt-6 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition">
            AUTHENTICATE
          </button>
        </form>
      </div>
    </div>
  );
}
