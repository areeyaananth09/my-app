# OTP Email Authentication

This application now supports **OTP (One-Time Password) email authentication** as an alternative to traditional password-based login.

## Features

✅ **Passwordless Login** - Users can login using only their email and a verification code  
✅ **Secure OTP Generation** - 6-digit codes with 10-minute expiration  
✅ **Beautiful Email Templates** - Professional HTML emails with branded design  
✅ **Auto User Creation** - New users are automatically created on first OTP login  
✅ **Session Management** - Seamless integration with Better Auth sessions  

## How It Works

### User Flow

1. **Click "Login with code"** on the sign-in or sign-up page
2. **Enter email address** - User provides their email
3. **Receive OTP** - A 6-digit code is sent to their mailbox
4. **Verify code** - User enters the code to authenticate
5. **Logged in** - Session is created and user is redirected

### Technical Flow

```
User enters email
    ↓
API generates 6-digit OTP
    ↓
OTP stored in database (expires in 10 min)
    ↓
Email sent via nodemailer
    ↓
User enters OTP
    ↓
API verifies OTP against database
    ↓
User created/retrieved
    ↓
Session created
    ↓
Cookie set
```

## Setup Instructions

### 1. Install Dependencies

Already installed:
- `nodemailer` - For sending emails
- `@types/nodemailer` - TypeScript types

### 2. Configure Environment Variables

Add these to your `.env` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_NAME=Your App Name
```

See `SMTP_SETUP.md` for detailed provider-specific instructions.

### 3. Run Database Migration

Execute the migration to create the OTP table:

```bash
# If using a SQL client, run:
db/migrations/001_create_otp_table.sql

# Or if you have a migration tool configured:
npm run migrate
```

### 4. Test the Feature

1. Start your dev server: `npm run dev`
2. Navigate to `/sign-in` or `/sign-up`
3. Click "Login with code"
4. Enter your email
5. Check your inbox for the OTP
6. Enter the code and verify

## API Endpoints

### POST `/api/otp/send`

Generates and sends an OTP to the provided email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

### POST `/api/otp/verify`

Verifies the OTP and creates/authenticates the user.

**Request:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

## Database Schema

### OTP Table

```sql
CREATE TABLE otp (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL
);
```

**Indexes:**
- `idx_otp_email` - Fast email lookups
- `idx_otp_expires_at` - Efficient expiration checks

## Components

### `<OTPLogin />`

Reusable component for OTP authentication flow.

**Props:**
- `onBack?: () => void` - Optional callback when user clicks back button

**Usage:**
```tsx
import OTPLogin from "@/components/otp-login";

<OTPLogin onBack={() => setLoginMethod("password")} />
```

## Security Features

- ✅ **Time-limited codes** - OTPs expire after 10 minutes
- ✅ **Single-use codes** - Codes are marked as verified after use
- ✅ **Email validation** - Validates email format before sending
- ✅ **Secure sessions** - HttpOnly cookies with proper expiration
- ✅ **Old OTP cleanup** - Previous OTPs are deleted when new ones are generated

## Customization

### Email Template

Edit `lib/email.ts` to customize the email design:

```typescript
export async function sendOTPEmail(email: string, otp: string) {
    // Customize the HTML template here
}
```

### OTP Length

Change the OTP length in `lib/email.ts`:

```typescript
export function generateOTP(): string {
    // For 8-digit OTP:
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}
```

### Expiration Time

Modify expiration in `app/api/otp/send/route.ts`:

```typescript
const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
```

## Troubleshooting

### Emails not sending

1. **Check SMTP credentials** - Verify your `.env` file
2. **Enable "Less secure app access"** - For Gmail, use App Passwords
3. **Check spam folder** - OTP emails might be filtered
4. **Review logs** - Check console for nodemailer errors

### OTP verification fails

1. **Check expiration** - OTPs expire after 10 minutes
2. **Verify email match** - Email must match exactly
3. **Check database** - Ensure OTP table exists and is accessible

### Type errors

If you see TypeScript errors for nodemailer:
```bash
npm install --save-dev @types/nodemailer
```

## Production Considerations

### Email Service

For production, consider using:
- **SendGrid** - Reliable transactional email service
- **AWS SES** - Cost-effective for high volume
- **Mailgun** - Developer-friendly API
- **Postmark** - Fast delivery times

### Rate Limiting

Add rate limiting to prevent abuse:
```typescript
// Limit OTP requests per email per hour
const MAX_OTP_PER_HOUR = 5;
```

### Cleanup Job

Schedule a job to delete expired OTPs:
```sql
DELETE FROM otp WHERE expires_at < NOW();
```

## Files Modified/Created

### Created:
- `lib/email.ts` - Email utility with nodemailer
- `app/api/otp/send/route.ts` - OTP generation endpoint
- `app/api/otp/verify/route.ts` - OTP verification endpoint
- `components/otp-login.tsx` - OTP login UI component
- `db/migrations/001_create_otp_table.sql` - Database migration
- `SMTP_SETUP.md` - Email provider setup guide
- `OTP_FEATURE.md` - This documentation

### Modified:
- `lib/schema.ts` - Added OTP table schema
- `app/(auth)/sign-in/page.tsx` - Added OTP login option
- `app/(auth)/sign-up/page.tsx` - Added OTP login option
- `package.json` - Added nodemailer dependencies

## Support

For issues or questions, refer to:
- [Better Auth Documentation](https://better-auth.com)
- [Nodemailer Documentation](https://nodemailer.com)
- [SMTP Setup Guide](./SMTP_SETUP.md)
