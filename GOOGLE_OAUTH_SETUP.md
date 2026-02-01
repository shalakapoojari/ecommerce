# Google OAuth Setup Guide

## Overview

This guide walks you through setting up Google OAuth for seamless social login on your U.S ATELIER e-commerce platform. Google OAuth enables users to sign in with their Google account in a single click.

## Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com)
- Your application URL (for development: `http://localhost:5000`)

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click on the project dropdown at the top left
3. Click "New Project"
4. Enter project name: `U.S ATELIER` (or your preferred name)
5. Click "Create"
6. Wait for the project to be created (2-3 minutes)

### 2. Enable Google+ API

1. In the Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and select "Enable"
4. Wait for it to enable

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. If prompted, configure the OAuth consent screen first:
   - Select "External" user type
   - Click "Create"
   - Fill in the required information:
     - App name: `U.S ATELIER`
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue"
   - Add the following scopes:
     - `openid`
     - `email`
     - `profile`
   - Click "Save and Continue"
   - Click "Back to Dashboard"

4. Go back to "Credentials"
5. Click "Create Credentials" → "OAuth 2.0 Client ID"
6. Choose "Web application"
7. Name: `U.S ATELIER Web App`
8. Add Authorized JavaScript origins:
   ```
   http://localhost:5000
   http://127.0.0.1:5000
   https://yourdomain.com (for production)
   ```
9. Add Authorized redirect URIs:
   ```
   http://localhost:5000/api/auth/google/callback
   http://127.0.0.1:5000/api/auth/google/callback
   https://yourdomain.com/api/auth/google/callback (for production)
   ```
10. Click "Create"
11. Copy the Client ID and Client Secret

### 4. Update Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the following variables in `.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id-from-step-3
   GOOGLE_CLIENT_SECRET=your-client-secret-from-step-3
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
   ```

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

### 6. Test Google Login

1. Start the Flask application:
   ```bash
   python app.py
   ```

2. Navigate to `http://localhost:5000/login`
3. You should see the "Continue with Google" button
4. Click it and follow the authentication flow
5. You should be automatically logged in and redirected to your account

## Production Setup

### Update Redirect URI for Production

1. Update your `.env` file for production:
   ```
   GOOGLE_CLIENT_ID=your-production-client-id
   GOOGLE_CLIENT_SECRET=your-production-client-secret
   GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
   ```

2. Update Google Cloud Console authorized URIs:
   - Go to "Credentials" → Your OAuth app
   - Add your production domain to both:
     - Authorized JavaScript origins
     - Authorized redirect URIs
   - Save changes

3. Ensure your application is served over HTTPS
4. Test the login flow with your production URL

## Troubleshooting

### "Google OAuth not configured" message

- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env`
- Restart the Flask application
- Check that `.env` file is in the project root

### Redirect URI mismatch error

- Ensure the redirect URI in `.env` matches exactly with what's configured in Google Cloud Console
- Check for trailing slashes or typos
- Restart the application after updating `.env`

### "Failed to exchange authentication code"

- Verify `GOOGLE_CLIENT_SECRET` is correct
- Check that you have internet connectivity
- Ensure the Google+ API is enabled in your Google Cloud project

### User information not retrieved

- Verify the Google account has an email address
- Check that profile scope is enabled in OAuth consent screen
- Ensure no browser extensions are blocking the request

## How It Works

1. **User clicks "Continue with Google"** on login/signup page
2. **Browser redirects to Google login** where user authenticates
3. **Google redirects back** with authentication code
4. **Backend exchanges code for tokens** and retrieves user information
5. **User is created/updated** in the system with their Google email
6. **Session is established** and user is logged in
7. **Redirect to account page** or home screen

## Security Considerations

- OAuth tokens are never exposed to the frontend
- User passwords are not handled (when using Google login)
- HTTPS is required for production
- State parameter validates the OAuth flow
- Session cookies are secure and HTTP-only

## User Experience

### Login Flow
- User clicks "Continue with Google"
- Single-click sign in if already logged into Google
- Automatic account creation on first sign-in
- Seamless redirect to account dashboard

### Benefits
- **No password required** - easier for users
- **Fast sign-in** - one-click authentication
- **Secure** - uses industry-standard OAuth 2.0
- **No password management** - reduced support burden

## Advanced Configuration

### Custom Scopes

If you need additional user information, modify `app.py`:

```python
# Current scopes:
scope=openid%20email%20profile

# You can add:
scope=openid%20email%20profile%20phone%20address
```

### Auto-fill User Profile

After authentication, user's name from Google is stored and can be used for profile information:

```python
userinfo = userinfo_response.json()
email = userinfo.get('email')
name = userinfo.get('name')
picture_url = userinfo.get('picture')
```

### Link Existing Accounts

To link Google accounts with existing password-based accounts:

```python
# Check if email exists
existing_user = find_user_by_email(email)
if existing_user:
    # Link Google to existing account
    existing_user['oauth_provider'] = 'google'
```

## Testing

### Test Accounts

You can add test user emails in Google Cloud Console:
- Go to OAuth consent screen
- Add test users
- These users can test the app without approval

### Test Credentials

For testing purposes, you can set:
```
GOOGLE_CLIENT_ID=test-client-id
GOOGLE_CLIENT_SECRET=test-client-secret
```

The login button will still appear but will redirect to an error message instead of Google.

## API Endpoints

### Check Google OAuth Status
```
GET /api/auth/google/status
Response: { "configured": true, "client_id": "..." }
```

### Get Google Login URL
```
POST /api/auth/google/login
Response: { "auth_url": "https://accounts.google.com/..." }
```

### OAuth Callback (automatic)
```
GET /api/auth/google/callback?code=...&state=...
```

## Support

For issues with Google OAuth setup:
- Check [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- Verify your project settings in Cloud Console
- Check browser console for JavaScript errors
- Review Flask logs for backend errors

## Next Steps

1. Test Google login on your local development server
2. Deploy to production with updated redirect URIs
3. Monitor login analytics
4. Gather user feedback on the new authentication method

---

Need help? Check the main README.md or DEPLOYMENT.md for additional guidance.
