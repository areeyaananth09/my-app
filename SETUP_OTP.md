# Quick Setup Guide for OTP Authentication

Follow these steps to get OTP email authentication working:

## 1. Configure Email Settings

Add these environment variables to your `.env` file:

```env
# For Gmail (recommended for testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_app_password_here
SMTP_FROM_NAME=My App
```

### Getting Gmail App Password:
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Visit: https://myaccount.google.com/apppasswords
4. Create a new app password for "Mail"
5. Copy the 16-character password to `SMTP_PASS`

## 2. Run Database Migration

Create the OTP table in your database:

```bash
npm run migrate-otp
```

This will create the `otp` table with proper indexes.

## 3. Test the Feature

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000/sign-in

3. Click the **"Login with code"** button

4. Enter your email address

5. Check your inbox for the 6-digit code

6. Enter the code to login

## Troubleshooting

### "Failed to send OTP email"
- Check your SMTP credentials in `.env`
- Verify your Gmail app password is correct
- Check if 2FA is enabled on your Google account

### "Invalid or expired OTP"
- OTP codes expire after 10 minutes
- Make sure you're entering the correct code
- Try requesting a new code

### Migration fails
- Ensure `DATABASE_URL` is set in your `.env`
- Check database connection
- Verify you have write permissions

## What's Next?

- Customize the email template in `lib/email.ts`
- Add rate limiting to prevent abuse
- Set up a production email service (SendGrid, AWS SES, etc.)
- Add cleanup job for expired OTPs

For detailed documentation, see `OTP_FEATURE.md`
