import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./schema";
import { emailOTP } from "better-auth/plugins/email-otp"; // 1.3.0-beta... check version if needed but this is standard
import { sendOTPEmail } from "./email";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL as string,
    secret: process.env.BETTER_AUTH_SECRET as string,
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: { ...schema }
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        apple: {
            clientId: process.env.APPLE_CLIENT_ID as string,
            clientSecret: process.env.APPLE_CLIENT_SECRET as string,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }: { email: string, otp: string, type: "sign-in" | "email-verification" | "forget-password" }) {
                console.log('[Auth] Sending OTP to:', email);
                if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
                    console.error('[Auth] SMTP credentials missing');
                    throw new Error("SMTP configuration missing");
                }

                const result = await sendOTPEmail(email, otp);
                if (!result.success) {
                    console.error('[Auth] Failed to send OTP:', result.error);
                    throw new Error("Failed to send OTP email");
                }
                console.log('[Auth] OTP sent successfully');
            },
        }),
    ],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
                input: false, // Don't allow user to set their own role
                returned: true, // Include role in session
            },
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google", "apple", "github"],
        },
    },
});

