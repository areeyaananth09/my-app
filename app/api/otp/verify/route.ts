import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { otp, user, session } from '@/lib/schema';
import { eq, and, gt } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const { email, code } = await request.json();

        console.log('[OTP Verify] Attempting to verify OTP for email:', email);

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
            console.log('[OTP Verify] Invalid or expired OTP');
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

        console.log('[OTP Verify] OTP verified successfully');

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
            console.log('[OTP Verify] Creating new user with ID:', newUserId);
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
            console.log('[OTP Verify] User already exists with ID:', userId);
            // Update emailVerified if not already verified
            if (!existingUser[0].emailVerified) {
                await db
                    .update(user)
                    .set({ emailVerified: true, updatedAt: new Date() })
                    .where(eq(user.id, userId));
            }
        }

        // Delete any existing sessions for this user to avoid conflicts
        await db
            .delete(session)
            .where(eq(session.userId, userId));

        console.log('[OTP Verify] Deleted old sessions for user');

        // Get IP address and user agent from request
        const ipAddress = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        // Create a new session
        const sessionId = crypto.randomUUID();
        const sessionToken = crypto.randomUUID();
        const sessionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        await db.insert(session).values({
            id: sessionId,
            userId,
            token: sessionToken,
            expiresAt: sessionExpiresAt,
            ipAddress,
            userAgent,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log('[OTP Verify] Created new session with token:', sessionToken.substring(0, 8) + '...');

        // Create response
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
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        });

        console.log('[OTP Verify] Session cookie set successfully');

        return response;
    } catch (error) {
        console.error('[OTP Verify] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
