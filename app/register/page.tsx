"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Lock,
  VenusAndMars,
  Eye,
  EyeOff,
  ArrowRight,
  BriefcaseMedical,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassowrd] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          gender: form.gender,
          phone_number: form.phone_number,
          pass_hash: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      router.push("/login?register=true");
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-md mx-auto my-10 w-140 border bg-gray-100 p-10"
    >
      <div className="text-center mb-xl">
        <div className="inline-flex items-center justify-center rounded-full mb-md text-primary">
          <BriefcaseMedical size={40}/>
        </div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
          Create Account
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Join Medi Check to manage your routine.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {/* First Name */}
        <div>
          <label
            className="block font-label-bold text-label-bold text-on-surface mb-xs"
            htmlFor="first_name"
          >
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-on-surface-variant">
              <User size={20} />
            </div>
            <input
              className="w-full pl-xl pr-sm py-sm bg-surface border border-outline-variant rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors font-body-md text-body-md text-on-surface placeholder:text-outline h-12"
              id="first_name"
              name="first_name"
              placeholder="Your First name"
              required
              type="text"
              value={form.first_name}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label
            className="block font-label-bold text-label-bold text-on-surface mb-xs"
            htmlFor="last_name"
          >
            Last Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-on-surface-variant">
              <User size={20} />
            </div>
            <input
              className="w-full pl-xl pr-sm py-sm bg-surface border border-outline-variant rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors font-body-md text-body-md text-on-surface placeholder:text-outline h-12"
              id="last_name"
              name="last_name"
              placeholder="Your Last name"
              required
              type="text"
              value={form.last_name}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          className="block font-label-bold text-label-bold text-on-surface mb-xs"
          htmlFor="email"
        >
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-on-surface-variant">
            <Mail size={20} />
          </div>
          <input
            className="w-full pl-xl pr-sm py-sm bg-surface border border-outline-variant rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors font-body-md text-body-md text-on-surface placeholder:text-outline h-12"
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

      {/* Gender */}
      <div>
        <label
          className="block font-label-bold text-label-bold text-on-surface mb-xs"
          htmlFor="gender"
        >
          Gender
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-on-surface-variant">
            <VenusAndMars size={20} />
          </div>
          <select
            className="w-full pl-xl pr-sm py-sm bg-surface border border-outline-variant rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors font-body-md text-body-md text-on-surface h-12 appearance-none"
            id="gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">What is your Gender?</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <label
          className="block font-label-bold text-label-bold text-on-surface mb-xs"
          htmlFor="phone_number"
        >
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-on-surface-variant">
            <Phone
             size={20} />
          </div>
          <input
            className="w-full pl-xl pr-sm py-sm bg-surface border border-outline-variant rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors font-body-md text-body-md text-on-surface placeholder:text-outline h-12"
            id="phone_number"
            name="phone_number"
            placeholder="Your Phone Number"
            type="tel"
            value={form.phone_number}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label
          className="block font-label-bold text-label-bold text-on-surface mb-xs"
          htmlFor="password"
        >
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-on-surface-variant">
            <Lock size={20} />
          </div>
          <input
            className="w-full pl-xl pr-10 py-sm bg-surface border border-outline-variant rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors font-body-md text-body-md text-on-surface placeholder:text-outline h-12"
            id="password"
            name="password"
            placeholder="Create Password"
            required
            minLength={8}
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
          />
          <button
            className="absolute inset-y-0 right-0 pr-sm flex items-center text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
            type="button"
            onClick={() => setShowPassowrd((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <p className="mt-xs font-label-sm text-label-sm text-on-surface-variant">
          Must be at least 8 characters.
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          className="block font-label-bold text-label-bold text-on-surface mb-xs"
          htmlFor="confirmPassword"
        >
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-on-surface-variant">
            <Lock size={20} />
          </div>
          <input
            className="w-full pl-xl pr-10 py-sm bg-surface border border-outline-variant rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors font-body-md text-body-md text-on-surface placeholder:text-outline h-12"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
            minLength={8}
            type={showConfirmPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <button
            className="absolute inset-y-0 right-0 pr-sm flex items-center text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {error && <p className="text-error font-body-md text-body-md">{error}</p>}

      {/* Submit Button */}
      <div className="pt-md">
        <button
          className="w-full h-12 bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-bold text-label-bold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface-container-lowest flex items-center justify-center gap-2 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
          {!loading && <ArrowRight size={20} />}
        </button>
      </div>

      <p>Already have an account? <Link href="/login">Login</Link></p>
    </form>
  );
}
