# Login Guide - U.S ATELIER

## Quick Access

- **Login Page**: http://localhost:5000/login
- **Signup Page**: http://localhost:5000/signup
- **Demo User**: user@example.com / password123
- **Demo Admin**: admin@example.com / password123

## Login Methods

### 1. Email & Password (Always Available)

The traditional login method:

1. Go to http://localhost:5000/login
2. Enter email and password
3. Click "Sign In"
4. You'll be redirected to your account

**Benefits**:
- No external dependencies
- Works offline
- Complete control over credentials

### 2. Google OAuth (Optional)

One-click login with your Google account:

1. Go to http://localhost:5000/login
2. Click "Continue with Google" button
3. You'll be redirected to Google login (if not already logged in)
4. Confirm your Google account
5. Automatically logged in and redirected to account

**Benefits**:
- Super fast (one click)
- No need to remember another password
- Secure (Google handles authentication)
- Automatic account creation on first login
- Works on mobile

## Setup For Google Login

### For Users

If you see "Continue with Google" button:
1. Click it
2. Use your existing Google account
3. Done! You're logged in

### For Admins/Developers

To enable Google login for users:

1. Follow [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)
2. Get Google OAuth credentials
3. Add to `.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```
4. Restart Flask app
5. Google button will now appear on login page

## Common Issues

### "Continue with Google" button not showing

**Solution**:
- Check if `GOOGLE_CLIENT_ID` is set in `.env`
- Restart the Flask application
- Refresh the page

### Google login redirects to error page

**Possible causes**:
- Google credentials not configured
- Mismatch between configured and actual URLs
- Browser cookies cleared

**Solution**:
- Check `.env` file has correct credentials
- Clear browser cookies and try again
- Try in incognito/private mode

### "Invalid credentials" with email/password

**Solution**:
- Check email is correct (case-insensitive)
- Verify password is exactly right
- Try demo credentials first: user@example.com / password123
- Create a new account if you forgot password

### "Account already exists"

**When creating account**:
- Email is already registered
- Use "Sign In" instead of "Sign Up"
- Or use different email

### Session expires

**Why it happens**:
- Default session timeout: 24 hours
- Browser cookies cleared
- Logged out manually

**Solution**:
- Log back in
- Session starts fresh

## Account Management

### Creating a New Account

1. Go to http://localhost:5000/signup
2. Enter email and password (min 6 characters)
3. Confirm password
4. Click "Create Account"
5. Account created and logged in

**OR** use Google:
1. Go to http://localhost:5000/signup
2. Click "Sign up with Google"
3. Use your Google account
4. Automatically logged in

### Changing Password

1. Log in to account
2. Go to http://localhost:5000/account
3. Look for "Change Password" section (if implemented)
4. Enter new password
5. Confirm changes

### Resetting Password

Currently not implemented. To reset:
1. Create new account with different email
2. Or contact admin

### Logging Out

1. Click "Logout" button (top right)
2. Session ends
3. Redirected to home page

## Security Tips

### For Users

1. **Use strong passwords** (mix of letters, numbers, symbols)
2. **Don't share login credentials** with anyone
3. **Keep Google account secure** (if using Google login)
4. **Enable 2-factor authentication** on your Google account
5. **Log out on shared computers**
6. **Don't save passwords** in browsers if using public devices

### For Admins

1. **Use strong SECRET_KEY** (change from default)
2. **Enable HTTPS** in production
3. **Keep credentials in .env** (never commit to git)
4. **Monitor login attempts** for suspicious activity
5. **Update dependencies** regularly
6. **Use strong admin password**

## Technical Details

### Session Management

- **Duration**: 24 hours
- **Type**: Server-side session
- **Storage**: Flask session (in-memory for now)
- **Cookie**: Secure, HTTP-only, same-site

### Password Security

- **Hashing**: Bcrypt with salt
- **Never stored plain text**: Always hashed
- **Verified server-side**: Every login checked

### Google OAuth Flow

```
Client → Server
"User wants to login with Google"
   ↓
Server → Google
"Exchange code for token"
   ↓
Google → Server
"Here's user info"
   ↓
Server → Client
"You're logged in!"
```

## API Endpoints (For Developers)

### Login
```
POST /api/auth/login
Body: {"email": "user@example.com", "password": "password123"}
Response: {"success": true, "user": "user@example.com"}
```

### Signup
```
POST /api/auth/signup
Body: {"email": "new@example.com", "password": "password123"}
Response: {"success": true, "user": "new@example.com"}
```

### Check Current User
```
GET /api/auth/user
Response: {"user": "user@example.com"} or {"user": null}
```

### Logout
```
POST /api/auth/logout
Response: {"success": true}
```

### Google Login Initiate
```
POST /api/auth/google/login
Response: {"auth_url": "https://accounts.google.com/..."}
```

### Google Config Status
```
GET /api/auth/google/config
Response: {"configured": true, "clientId": "..."}
```

## Demo Accounts

### User Account
- **Email**: user@example.com
- **Password**: password123
- **Access**: Browse products, add to cart, checkout, view account

### Admin Account
- **Email**: admin@example.com
- **Password**: password123
- **Access**: Everything above + product management, order management, admin dashboard

## Troubleshooting Checklist

- [ ] Flask app is running (`python app.py`)
- [ ] You can access http://localhost:5000
- [ ] Email is correctly typed
- [ ] Password is correctly typed
- [ ] Browser cookies are enabled
- [ ] Not using outdated browser
- [ ] Try incognito/private mode
- [ ] Check `.env` file exists
- [ ] Check Flask logs for errors

## Getting Help

1. Check this guide first
2. Read [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for OAuth issues
3. Check [README.md](./README.md) for general setup
4. Look at Flask logs for error messages
5. Try the demo credentials
6. Create a fresh test account

## Next Steps

After logging in:

1. **Browse products** on shop page
2. **Add items** to cart
3. **Checkout** to complete purchase
4. **View account** to see orders and profile
5. **Manage settings** in account dashboard

---

**Happy shopping at U.S ATELIER!**

For more information, visit the [README](./README.md) or check out our other documentation files.
