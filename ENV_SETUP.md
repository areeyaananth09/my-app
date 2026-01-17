# Environment Variables Setup Guide

## Quick Fix for "unable_to_link_account" Error

Your `.env.local` file needs to be properly formatted. Follow these steps:

### Step 1: Check Your `.env.local` File Format

Open `.env.local` and make sure it looks like this (with NO quotes, NO extra spaces):

```env
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
```

### Step 2: Common Mistakes to Avoid

❌ **WRONG - Don't do this:**
```env
DATABASE_URL = "postgresql://..."  # No quotes, no spaces around =
BETTER_AUTH_URL = 'http://localhost:3000'  # No quotes
GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"  # No quotes
```

✅ **CORRECT - Do this:**
```env
DATABASE_URL=postgresql://...
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
```

### Step 3: Required Variables

Make sure you have ALL of these variables:

1. **DATABASE_URL** - Your Neon PostgreSQL connection string
   - Format: `postgresql://username:password@host/database?sslmode=require`
   - Get this from: https://console.neon.tech/

2. **BETTER_AUTH_URL** - Your app URL
   - For local development: `http://localhost:3000`
   - For production: `https://yourdomain.com`

3. **BETTER_AUTH_SECRET** - A random secret key (32+ characters)
   - Generate one with: `openssl rand -base64 32`
   - Or use any random 32+ character string

4. **NEXT_PUBLIC_BETTER_AUTH_URL** - Same as BETTER_AUTH_URL
   - For local development: `http://localhost:3000`
   - This MUST have the `NEXT_PUBLIC_` prefix

5. **GOOGLE_CLIENT_ID** - From Google Cloud Console
   - Format: `123456789-abcdefghijk.apps.googleusercontent.com`

6. **GOOGLE_CLIENT_SECRET** - From Google Cloud Console
   - Format: `GOCSPX-abcdefghijklmnop`

### Step 4: Complete Example

Here's a complete working example:

```env
# Database
DATABASE_URL=postgresql://myuser:mypassword@ep-cool-cloud-123456.us-east-1.aws.neon.tech/mydb?sslmode=require

# Better Auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abc123def456ghi789jkl012.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz

# Optional: Apple OAuth
APPLE_CLIENT_ID=com.yourapp.service
APPLE_CLIENT_SECRET=your-apple-secret

# Optional: SMTP for OTP emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
```

### Step 5: After Updating `.env.local`

1. **Save the file**
2. **Restart your dev server:**
   ```bash
   # Stop the server (Ctrl+C in terminal)
   npm run dev
   ```
3. **Try logging in with Google again**

## Troubleshooting

### Error: "Reload env: .env.local cause: undefined"

This means there's a syntax error in your `.env.local` file. Check for:
- Quotes around values (remove them)
- Spaces around the `=` sign (remove them)
- Missing required variables
- Invalid characters or line breaks

### Error: "DATABASE_URL is not defined"

Make sure the first line of your `.env.local` is:
```env
DATABASE_URL=postgresql://...
```

### Error: "unable_to_link_account"

This means Better Auth can't connect. Make sure you have:
- `BETTER_AUTH_URL=http://localhost:3000`
- `BETTER_AUTH_SECRET=your-secret-here` (32+ characters)
- `NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000`

### Still Having Issues?

1. Delete your `.env.local` file
2. Create a new one from scratch
3. Copy the example above
4. Replace with your actual values
5. Make sure there are NO quotes
6. Save and restart the server

## Security Notes

- ✅ Never commit `.env.local` to Git (it's already in `.gitignore`)
- ✅ Keep your secrets private
- ✅ Use different credentials for development and production
- ✅ Regularly rotate your secrets
