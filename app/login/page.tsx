"use client";
import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, LogIn, BriefcaseMedical  } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Invalid credentials");
        return;
      }

      router.push("/me");
      router.refresh();
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-md mx-auto my-10 w-140 border bg-gray-100 p-10">
        <div className="text-center mb-xl">
          <div className="inline-flex items-center justify-center rounded-full mb-md text-primary">
            <BriefcaseMedical size={40}/>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
            Login to your account
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Join Medi Check to manage your routine.
          </p>
        </div>
        {/* Email Field */}
        <div className="flex flex-col gap-base">
          <label className="font-label-bold text-label-bold text-on-surface" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail size={20} className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              className="w-full h-12 pl-[48px] pr-md bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:border-2 transition-all duration-200"
              id="email"
              name="email"
              placeholder="Your Email Address"
              required
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-base">
          <div className="flex items-center justify-between">
            <label className="font-label-bold text-label-bold text-on-surface" htmlFor="password">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock size={20} className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              className="w-full h-12 pl-[48px] pr-[48px] bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:border-2 transition-all duration-200"
              id="password"
              name="password"
              placeholder="Enter your Password"
              required
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
            />
            <button
              aria-label="Toggle password visibility"
              className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none"
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && <p className="font-body-md text-body-md text-error">{error}</p>}

        {/* Action Area */}
        <div className="pt-sm">
          <button
            className="w-full h-12 bg-primary hover:bg-on-primary-fixed-variant text-on-primary rounded-full flex items-center justify-center gap-sm transition-colors duration-200 active:scale-[0.98] disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            <span className="font-label-bold text-label-bold">
              {loading ? "Logging in..." : "Login"}
            </span>
            {!loading && <LogIn size={20} />}
          </button>
        </div>
        <p>
          Don't have an account? <Link href="/register">Register</Link>
        </p>
      </form>
    </>
  );
}