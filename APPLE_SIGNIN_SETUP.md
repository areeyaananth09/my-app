# Apple Sign-In Setup Guide

Follow these steps to set up Sign in with Apple for your app.

## Prerequisites

- An **Apple Developer Account** ($99/year)
- Access to **Apple Developer Portal**

## Step 1: Create an App ID

1. **Go to Apple Developer Portal**
   - Visit: https://developer.apple.com/account/

2. **Navigate to Certificates, Identifiers & Profiles**
   - Click on "Certificates, Identifiers & Profiles" in the left sidebar

3. **Create an App ID**
   - Click "Identifiers" → Click the "+" button
   - Select "App IDs" → Click "Continue"
   
   **Configure App ID:**
   - Description: `My App`
   - Bundle ID: Select "Explicit"
   - Bundle ID: `com.yourcompany.myapp` (use your actual bundle ID)
   
   **Capabilities:**
   - Scroll down and check "Sign in with Apple"
   - Click "Continue" → Click "Register"

## Step 2: Create a Services ID

1. **Create Services ID**
   - Go back to "Identifiers"
   - Click the "+" button
   - Select "Services IDs" → Click "Continue"
   
   **Configure Services ID:**
   - Description: `My App Web`
   - Identifier: `com.yourcompany.myapp.web` (this will be your Client ID)
   - Check "Sign in with Apple"
   - Click "Continue" → Click "Register"

2. **Configure Sign in with Apple**
   - Click on the Services ID you just created
   - Check "Sign in with Apple"
   - Click "Configure" next to it
   
   **Domains and Subdomains:**
   ```
   localhost (for development)
   yourdomain.com (for production)
   ```
   
   **Return URLs:**
   ```
   http://localhost:3000/api/auth/callback/apple
   https://yourdomain.com/api/auth/callback/apple
   ```
   
   - Click "Next" → Click "Done" → Click "Continue" → Click "Save"

## Step 3: Create a Private Key

1. **Create Key**
   - Go to "Keys" in the left sidebar
   - Click the "+" button
   
   **Configure Key:**
   - Key Name: `My App Sign in with Apple Key`
   - Check "Sign in with Apple"
   - Click "Configure" next to it
   - Select your App ID (Primary App ID)
   - Click "Save" → Click "Continue" → Click "Register"

2. **Download the Key**
   - Click "Download" to download the `.p8` file
   - **IMPORTANT:** Save this file securely - you can only download it once!
   - Note the **Key ID** (10 characters, e.g., `ABC123DEFG`)

## Step 4: Get Your Team ID

1. **Find Team ID**
   - Go to "Membership" in the left sidebar
   - Your **Team ID** is displayed (10 characters, e.g., `XYZ987WXYZ`)
   - Copy this value

## Step 5: Generate Client Secret

Apple requires a JWT token as the client secret. You'll need to generate this programmatically.

### Create a script to generate the secret:

Create `scripts/generate-apple-secret.ts`:

```typescript
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

const teamId = 'YOUR_TEAM_ID'; // From Step 4
const clientId = 'com.yourcompany.myapp.web'; // Your Services ID
const keyId = 'YOUR_KEY_ID'; // From Step 3
const privateKey = fs.readFileSync('./path/to/AuthKey_KEYID.p8', 'utf8');

const token = jwt.sign(
    {
        iss: teamId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 180, // 180 days
        aud: 'https://appleid.apple.com',
        sub: clientId,
    },
    privateKey,
    {
        algorithm: 'ES256',
        keyid: keyId,
    }
);

console.log('Apple Client Secret:', token);
```

**Install jsonwebtoken:**
```bash
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

**Run the script:**
```bash
npx tsx scripts/generate-apple-secret.ts
```

## Step 6: Add to Environment Variables

Add these to your `.env` or `.env.local` file:

```env
# Apple Sign-In
APPLE_CLIENT_ID=com.yourcompany.myapp.web
APPLE_CLIENT_SECRET=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example:**
```env
APPLE_CLIENT_ID=com.mycompany.myapp.web
APPLE_CLIENT_SECRET=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFCQzEyM0RFRkcifQ.eyJpc3MiOiJYWVo5ODdXWFlaIiwiaWF0IjoxNzA1MDAwMDAwLCJleHAiOjE3MjA1NTIwMDAsImF1ZCI6Imh0dHBzOi8vYXBwbGVpZC5hcHBsZS5jb20iLCJzdWIiOiJjb20ubXljb21wYW55Lm15YXBwLndlYiJ9.abc123def456...
```

## Step 7: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Step 8: Test Apple Sign-In

1. Go to http://localhost:3000/sign-in
2. Click "Continue with Apple"
3. Sign in with your Apple ID
4. Choose whether to share or hide your email
5. You should be redirected back and logged in! 🎉

## Production Setup

### For production deployment:

1. **Update Services ID Configuration:**
   - Add your production domain to "Domains and Subdomains"
   - Add production callback URL:
     ```
     https://yourdomain.com/api/auth/callback/apple
     ```

2. **Regenerate Client Secret:**
   - Generate a new JWT token with production settings
   - Update `APPLE_CLIENT_SECRET` in production environment

3. **Verify Domain Ownership:**
   - Apple may require you to verify domain ownership
   - Download the verification file and place it in your domain's root

## Important Notes

### Client Secret Expiration
- The JWT token expires (max 6 months)
- You'll need to regenerate it periodically
- Set up a reminder to regenerate before expiration

### Email Privacy
- Users can choose to hide their email
- Apple provides a relay email: `privaterelay@appleid.com`
- Store the relay email in your database

### Testing
- Use a real Apple ID for testing
- Sandbox accounts don't work with Sign in with Apple
- Test on both iOS Safari and desktop browsers

## Troubleshooting

### Error: "invalid_client"
- Check that your Client ID matches the Services ID
- Verify the Client Secret (JWT) is valid and not expired
- Ensure the JWT is signed with the correct private key

### Error: "invalid_request"
- Verify redirect URI exactly matches what's configured
- Check that Services ID has Sign in with Apple enabled
- Ensure domain is properly configured

### Error: "unauthorized_client"
- Verify your App ID has Sign in with Apple capability
- Check that Services ID is properly linked to App ID
- Ensure private key is associated with correct App ID

### Private Key Issues
- If you lost the `.p8` file, create a new key
- You can have multiple keys active simultaneously
- Revoke old keys from the Apple Developer Portal

## Quick Links

- **Apple Developer Portal:** https://developer.apple.com/account/
- **Certificates & Identifiers:** https://developer.apple.com/account/resources/
- **Sign in with Apple Docs:** https://developer.apple.com/sign-in-with-apple/
- **JWT Debugger:** https://jwt.io/

## Security Best Practices

- ✅ Store the `.p8` private key securely (never commit to Git)
- ✅ Regenerate client secret regularly (before expiration)
- ✅ Use different keys for development and production
- ✅ Monitor Apple Developer account for security alerts
- ✅ Keep Team ID and Key ID confidential
- ✅ Use environment variables for all sensitive data

## Alternative: Simplified Setup (For Testing)

If you don't have an Apple Developer account yet, you can:

1. **Comment out Apple provider** in `lib/auth.ts` temporarily
2. **Remove Apple button** from auth pages
3. **Use Google and OTP** for authentication during development
4. **Add Apple later** when you have a developer account

This allows you to test other features without the $99 Apple Developer fee.
