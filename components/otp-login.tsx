"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface OTPLoginProps {
    onBack?: () => void;
}

export default function OTPLogin({ onBack }: OTPLoginProps) {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"email" | "otp">("email");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSendOTP = async () => {
        if (!email || !email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/email-otp/send-verification-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    type: "sign-in",
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || errorData.statusText || "Failed to send OTP");
            }

            setStep("otp");
        } catch (err: any) {
            setError(err.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit code");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/sign-in/email-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    otp,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || errorData.statusText || "Failed to verify OTP");
            }

            // Use window.location for full page reload to ensure session is loaded
            window.location.href = "/";
        } catch (err: any) {
            setError(err.message || "Failed to verify OTP");
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setOtp("");
        setError("");
        await handleSendOTP();
    };

    if (step === "email") {
        return (
            <div className="space-y-4">
                {onBack && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="mb-2"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                )}
                <div className="space-y-2">
                    <Label htmlFor="otp-email">Email</Label>
                    <Input
                        id="otp-email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                    />
                </div>
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
                <Button
                    className="w-full"
                    onClick={handleSendOTP}
                    disabled={loading}
                >
                    <Mail className="mr-2 h-4 w-4" />
                    {loading ? "Sending code..." : "Send login code"}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("email")}
                className="mb-2"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Change email
            </Button>
            <div className="space-y-2">
                <Label htmlFor="otp-code">Verification Code</Label>
                <p className="text-sm text-gray-500">
                    We sent a code to <strong>{email}</strong>
                </p>
                <Input
                    id="otp-code"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
                    className="text-center text-2xl tracking-widest"
                />
            </div>
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
            <Button
                className="w-full"
                onClick={handleVerifyOTP}
                disabled={loading}
            >
                {loading ? "Verifying..." : "Verify and login"}
            </Button>
            <Button
                variant="outline"
                className="w-full"
                onClick={handleResendOTP}
                disabled={loading}
            >
                Resend code
            </Button>
        </div>
    );
}
