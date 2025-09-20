"use client";

import { X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@repo/ui/button";

type AuthPageProps = {
    isSignin: boolean;
};

export function AuthPage({ isSignin }: AuthPageProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

    async function handleSubmit() {
        try {
            if (!email || !password || (!isSignin && (!name || !confirmPassword))) {
                alert("Please fill in all required fields.");
                return;
            }
            if (!isSignin && password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }

            const endpoint = isSignin ? "/signin" : "/signup";
            const body = isSignin
                ? { email, password }
                : { email, password, name };

            const res = await axios.post(`${baseUrl}${endpoint}`, body);

            alert(res.data.message);
            localStorage.setItem("token", res.data.token);

            console.log("Token:", res.data.token);
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to connect to server");
        }
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-black">
            <div className="p-6 bg-white rounded-lg shadow-xl w-96 relative">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-black">
                        {isSignin ? "Sign in" : "Sign up"}
                    </h2>
                    <button
                        className="text-gray-500 hover:text-black transition-colors cursor-pointer"
                        onClick={() => (window.location.href = "http://localhost:3001/")}
                    >
                        <X size={20} />
                    </button>
                </div>

                {!isSignin && (
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full mb-3 p-3 border border-black rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                        required
                    />
                )}

                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full mb-3 p-3 border border-black rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                    required
                />

                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full p-3 border border-black rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors cursor-pointer"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {!isSignin && (
                    <div className="relative mb-4">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full p-3 border border-black rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors cursor-pointer"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                )}

                <Button onClick={handleSubmit} variant="light">
                    {isSignin ? "Sign in" : "Sign up"}
                </Button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    {isSignin ? (
                        <>
                            Don’t have an account?{" "}
                            <button
                                onClick={() => router.push("/signup")}
                                className="text-black font-semibold hover:underline cursor-pointer"
                            >
                                Create one
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={() => router.push("/signin")}
                                className="text-black font-semibold hover:underline cursor-pointer"
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}