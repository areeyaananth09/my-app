import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { otp, user, session } from '@/lib/schema';
import { eq, and, gt } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json(
                { error: 'Email and code are required' },
                { status: 400 }
            );
        }

        // Find valid OTP
        const otpRecords = await db
            .select()
            .from(otp)
            .where(
                and(
                    eq(otp.email, email),
                    eq(otp.code, code),
                    eq(otp.verified, false),
                    gt(otp.expiresAt, new Date())
                )
            )
            .limit(1);

        if (otpRecords.length === 0) {
            return NextResponse.json(
                { error: 'Invalid or expired OTP' },
                { status: 400 }
            );
        }

        // Mark OTP as verified
        await db
            .update(otp)
            .set({ verified: true })
            .where(eq(otp.id, otpRecords[0].id));

        // Check if user exists
        let existingUser = await db
            .select()
            .from(user)
            .where(eq(user.email, email))
            .limit(1);

        let userId: string;

        if (existingUser.length === 0) {
            // Create new user if doesn't exist
            const newUserId = crypto.randomUUID();
            await db.insert(user).values({
                id: newUserId,
                email,
                name: email.split('@')[0], // Use email prefix as default name
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                role: 'user',
            });
            userId = newUserId;
        } else {
            userId = existingUser[0].id;
        }

        // Create session
        const sessionToken = crypto.randomUUID();
        const sessionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        await db.insert(session).values({
            id: crypto.randomUUID(),
            userId,
            token: sessionToken,
            expiresAt: sessionExpiresAt,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Set session cookie with Better Auth naming
        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            user: {
                id: userId,
                email,
            },
        });

        // Set the session token cookie
        response.cookies.set('better-auth.session_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
