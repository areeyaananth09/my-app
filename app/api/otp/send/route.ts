import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { otp } from '@/lib/schema';
import { generateOTP, sendOTPEmail } from '@/lib/email';
import { eq, and, gt } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email is required' },
                { status: 400 }
            );
        }

        // Generate OTP
        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Delete any existing OTPs for this email
        await db.delete(otp).where(eq(otp.email, email));

        // Store OTP in database
        await db.insert(otp).values({
            id: crypto.randomUUID(),
            email,
            code: otpCode,
            expiresAt,
            verified: false,
            createdAt: new Date(),
        });

        // Send OTP via email
        const emailResult = await sendOTPEmail(email, otpCode);

        if (!emailResult.success) {
            return NextResponse.json(
                { error: 'Failed to send OTP email' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'OTP sent to your email',
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
