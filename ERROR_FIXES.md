# 🔧 Error Fixes & Troubleshooting Guide

## ✅ All Issues Fixed in This Version

### 1. Tailwind CSS Configuration ✓
- ✅ Tailwind directives properly imported in `styles/globals.css`
- ✅ PostCSS configured in `postcss.config.js`
- ✅ Tailwind config file complete with all design tokens
- ✅ Global styles imported in `app/layout.tsx`

### 2. Missing Configuration Files ✓
- ✅ `.gitignore` added
- ✅ `.eslintrc.json` added
- ✅ `tsconfig.json` properly configured
- ✅ `next.config.js` with security headers

### 3. Import Path Aliases ✓
- ✅ TypeScript paths configured (`@/*`)
- ✅ All imports using correct aliases
- ✅ Component imports verified

### 4. Dependencies ✓
- ✅ All required packages in `package.json`
- ✅ Correct versions specified
- ✅ No missing peer dependencies

---

## 🚀 First-Time Setup (Step-by-Step)

### Step 1: Extract and Navigate
```bash
unzip fresh-veggies-complete.zip
cd fresh-veggies
```

### Step 2: Install Dependencies
```bash
npm install
```

**Expected output:**
```
added 300+ packages in 30s
```

**If you see errors:**
```bash
# Clear cache and try again
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Step 3: Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="run: openssl rand -base64 32"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate secrets:**
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Step 4: Database Setup

**Option A: Vercel Postgres (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Create database
vercel postgres create fresh-veggies-db

# Get connection string
vercel env pull .env.local
```

**Option B: Local PostgreSQL**
```bash
# Create database
createdb fresh_veggies

# Update .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/fresh_veggies"
```

### Step 5: Run Migrations
```bash
npm run db:push
```

**Expected output:**
```
✓ Applying migrations...
✓ Done!
```

### Step 6: Start Development
```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

---

## 🐛 Common Errors & Solutions

### Error: "Module not found: Can't resolve '@/...' "

**Cause:** TypeScript path aliases not recognized

**Solution:**
```bash
# Restart your IDE/editor
# VS Code: Cmd+Shift+P → "Reload Window"

# Or restart dev server
npm run dev
```

### Error: "Error: Cannot find module 'react-hot-toast'"

**Cause:** Dependencies not installed

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Tailwind CSS classes not working"

**Cause:** Tailwind not processing styles

**Solution 1 - Verify files exist:**
```bash
ls -la styles/globals.css
ls -la tailwind.config.js
ls -la postcss.config.js
```

**Solution 2 - Restart dev server:**
```bash
# Kill the process (Ctrl+C)
npm run dev
```

**Solution 3 - Clear Next.js cache:**
```bash
rm -rf .next
npm run dev
```

### Error: "Database connection failed"

**Cause:** Invalid DATABASE_URL

**Solution:**
```bash
# Check your .env.local file exists
ls -la .env.local

# Verify DATABASE_URL format:
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE
# Example: postgresql://postgres:mypass@localhost:5432/fresh_veggies

# For cloud databases, add SSL:
# postgresql://user:pass@host:5432/db?sslmode=require
```

### Error: "Error: connect ECONNREFUSED ::1:5432"

**Cause:** PostgreSQL not running

**Solution:**
```bash
# macOS
brew services start postgresql

# Ubuntu/Linux
sudo service postgresql start

# Windows
# Start PostgreSQL service from Services app

# Verify it's running
psql --version
```

### Error: "Invalid token" or authentication fails

**Cause:** JWT_SECRET not set or changed

**Solution:**
```bash
# Generate new secret
openssl rand -base64 32

# Add to .env.local
JWT_SECRET="paste-your-secret-here"

# Restart server
npm run dev

# Clear browser data
# Chrome: DevTools → Application → Clear storage
```

### Error: "Cannot read property 'map' of undefined"

**Cause:** Data not loaded from API

**Solution:**
1. Check browser console for API errors
2. Verify database has data
3. Check API route is working:
   ```bash
   curl http://localhost:3000/api/vegetables
   ```

### Error: "hydration mismatch" or "Text content does not match"

**Cause:** Server/client rendering mismatch

**Solution:**
```bash
# This is usually from localStorage in components
# Clear browser localStorage
# Chrome: DevTools → Application → Local Storage → Clear

# Or add suppressHydrationWarning to conflicting elements
<html suppressHydrationWarning>
```

### Error: Build fails with "Type error" in production

**Cause:** TypeScript strict mode errors

**Solution:**
```bash
# Check for type errors
npm run build

# Fix the errors shown
# Common fixes:
# - Add type annotations
# - Use proper null checks
# - Import missing types
```

### Error: "Port 3000 already in use"

**Cause:** Another process using port 3000

**Solution:**
```bash
# Find and kill the process
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

---

## ✅ Verification Checklist

After setup, verify everything works:

### 1. Homepage Loads ✓
- [ ] Navigate to http://localhost:3000
- [ ] See hero section with gradient
- [ ] See "Fresh Veggies" header
- [ ] Navigation menu visible
- [ ] No console errors

### 2. Styling Works ✓
- [ ] Colors are correct (green primary)
- [ ] Fonts loaded (Inter + Source Sans)
- [ ] Buttons have hover effects
- [ ] Cards have shadows
- [ ] Layout is responsive

### 3. Authentication Works ✓
- [ ] Click "Sign In" button
- [ ] Modal opens smoothly
- [ ] Form validation works
- [ ] Can register new user
- [ ] Can login
- [ ] Token stored in localStorage

### 4. Cart Works ✓
- [ ] Add item to cart (after login)
- [ ] Cart sidebar opens
- [ ] Item appears in cart
- [ ] Can update quantity
- [ ] Can remove item
- [ ] Cart persists on refresh

### 5. Admin Panel Works ✓
- [ ] Navigate to /admin
- [ ] Login as admin
- [ ] Dashboard shows stats
- [ ] Table displays vegetables
- [ ] Can add new vegetable
- [ ] Can edit vegetable
- [ ] Can delete vegetable

### 6. Database Works ✓
```bash
# Test database connection
npm run db:studio

# This should open Drizzle Studio
# You should see your tables
```

---

## 🔍 Debug Mode

Enable detailed logging:

```bash
# In your .env.local
DEBUG=*
NODE_ENV=development
```

Check Next.js dev output for:
- API route calls
- Database queries
- Build errors
- Runtime errors

---

## 📊 Performance Check

After setup, verify performance:

```bash
# Build for production
npm run build

# Should complete without errors
# Check output:
# Route (app)                              Size
# ┌ ○ /                                   10 kB
# ├ ○ /admin                              15 kB
# └ ○ /api/...                            [API routes]
```

---

## 🆘 Still Having Issues?

### 1. Check Node.js Version
```bash
node --version
# Should be v18.0.0 or higher
```

### 2. Check npm Version
```bash
npm --version
# Should be v9.0.0 or higher
```

### 3. Verify File Structure
```bash
# Should see all these files
ls -la app/layout.tsx
ls -la styles/globals.css
ls -la tailwind.config.js
ls -la package.json
ls -la .env.local
```

### 4. Check Dependencies Installed
```bash
ls -la node_modules/
# Should see many folders

# Check specific packages
ls node_modules/tailwindcss
ls node_modules/next
ls node_modules/react
```

### 5. Fresh Start
```bash
# Complete reset
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

---

## 📝 Environment Variables Reference

All required variables explained:

```env
# Database Connection (REQUIRED)
# Get from: Vercel, Supabase, or local PostgreSQL
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
# Add ?sslmode=require for cloud databases

# JWT Secret (REQUIRED)
# Used for authentication tokens
# Generate with: openssl rand -base64 32
JWT_SECRET="32+ character random string"

# NextAuth URL (REQUIRED)
# Development: http://localhost:3000
# Production: https://your-app.vercel.app
NEXTAUTH_URL="http://localhost:3000"

# NextAuth Secret (REQUIRED)
# Used for session encryption
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="32+ character random string"
```

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ `npm run dev` starts without errors
2. ✅ Homepage loads with styling
3. ✅ Can register and login
4. ✅ Can add items to cart
5. ✅ Admin panel is accessible
6. ✅ Database queries work
7. ✅ No console errors
8. ✅ Responsive on mobile

---

## 📞 Quick Commands Reference

```bash
# Install
npm install

# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Database
npm run db:push
npm run db:studio

# Clean
rm -rf .next node_modules package-lock.json

# Reset
npm install && npm run dev
```

---

**All errors are now fixed in this version!**
**Follow the setup steps and you'll be running in 15 minutes.**
