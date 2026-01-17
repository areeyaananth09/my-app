# Google OAuth Setup Guide

Follow these steps to set up Google OAuth authentication for your app.

## Step 1: Create a Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a new project** (or select an existing one)
   - Click on the project dropdown at the top
   - Click "New Project"
   - Enter project name: "My App" (or your app name)
   - Click "Create"

## Step 2: Enable Google+ API

1. **Go to APIs & Services**
   - In the left sidebar, click "APIs & Services" → "Library"

2. **Search for "Google+ API"**
   - Type "Google+ API" in the search box
   - Click on "Google+ API"
   - Click "Enable"

## Step 3: Create OAuth Credentials

1. **Go to Credentials**
   - Click "APIs & Services" → "Credentials"

2. **Configure OAuth Consent Screen** (if not done already)
   - Click "OAuth consent screen" tab
   - Select "External" (for testing) or "Internal" (for organization)
   - Click "Create"
   
   **Fill in the required fields:**
   - App name: `My App`
   - User support email: Your email
   - Developer contact email: Your email
   - Click "Save and Continue"
   
   **Scopes:**
   - Click "Add or Remove Scopes"
   - Add: `userinfo.email`, `userinfo.profile`, `openid`
   - Click "Save and Continue"
   
   **Test users** (for External apps):
   - Add your email address
   - Click "Save and Continue"

3. **Create OAuth Client ID**
   - Go back to "Credentials" tab
   - Click "Create Credentials" → "OAuth client ID"
   
   **Configure:**
   - Application type: `Web application`
   - Name: `My App Web Client`
   
   **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   https://yourdomain.com (for production)
   ```
   
   **Authorized redirect URIs:**
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google (for production)
   ```
   
   - Click "Create"

4. **Copy Your Credentials**
   - You'll see a popup with:
     - **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
     - **Client Secret** (looks like: `GOCSPX-abcdefghijklmnop`)
   - **Copy both of these!**

## Step 4: Add to Environment Variables

Add these to your `.env` or `.env.local` file:

```env
# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-at-least-32-characters-long-random-string
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

**Example:**
```env
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrst
```

**Note:** Generate a secure random string for `BETTER_AUTH_SECRET`. You can use:
```bash
openssl rand -base64 32
```

## Step 5: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Step 6: Test Google Login

1. Go to http://localhost:3000/sign-in
2. Click "Continue with Google"
3. Select your Google account
4. Grant permissions
5. You should be redirected back and logged in! 🎉

## Production Setup

For production deployment:

1. **Update Authorized Origins:**
   ```
   https://yourdomain.com
   ```

2. **Update Redirect URIs:**
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

3. **Publish OAuth Consent Screen:**
   - Go to "OAuth consent screen"
   - Click "Publish App"
   - Submit for verification (if needed)

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure your redirect URI in Google Console exactly matches:
  `http://localhost:3000/api/auth/callback/google`

### Error: "Access blocked: This app's request is invalid"
- Check that you've enabled Google+ API
- Verify OAuth consent screen is configured
- Add your email to test users (for External apps)

### Error: "Missing credentials"
- Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are in `.env`
- Restart your dev server after adding env variables

## Quick Links

- **Google Cloud Console:** https://console.cloud.google.com/
- **OAuth Consent Screen:** https://console.cloud.google.com/apis/credentials/consent
- **Credentials:** https://console.cloud.google.com/apis/credentials

## Security Notes

- ✅ Never commit `.env` files to Git
- ✅ Keep your Client Secret private
- ✅ Use different credentials for development and production
- ✅ Regularly rotate your secrets
- ✅ Enable 2FA on your Google Cloud account
