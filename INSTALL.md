# 🚀 Fresh Veggies - Installation Guide

## 📦 What's in This ZIP

**Complete vegetable ordering platform with:**
- ✅ 37 production-ready files
- ✅ Beautiful responsive UI with animations
- ✅ Complete admin panel for managing vegetables
- ✅ Shopping cart with persistence
- ✅ User authentication (JWT + bcrypt)
- ✅ PostgreSQL database integration
- ✅ Vercel deployment ready
- ✅ Mobile-first responsive design
- ✅ Dark mode support

---

## ⚡ Quick Install (15 Minutes)

### Step 1: Extract ZIP
Extract the `fresh-veggies-complete.zip` file to your desired location.

### Step 2: Open in Terminal
```bash
cd fresh-veggies
```

### Step 3: Install Dependencies (1 minute)
```bash
npm install
```

### Step 4: Set Up Environment Variables (2 minutes)

Copy the example file:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your values:

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@host:5432/database"

# Generate these secrets:
# Run: openssl rand -base64 32

JWT_SECRET="paste-generated-secret-here"
NEXTAUTH_SECRET="paste-another-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate secrets on Mac/Linux:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Step 5: Set Up Database (3 minutes)

**Option A: Use Vercel Postgres (Recommended)**
1. Go to https://vercel.com/dashboard
2. Click "Storage" → "Create Database" → "Postgres"
3. Copy the `DATABASE_URL` 
4. Paste into `.env.local`

**Option B: Use Supabase**
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Paste into `.env.local`

**Option C: Local PostgreSQL**
```bash
# Install PostgreSQL (if not installed)
# macOS
brew install postgresql

# Ubuntu
sudo apt install postgresql

# Start PostgreSQL
brew services start postgresql  # macOS
sudo service postgresql start   # Ubuntu

# Create database
createdb fresh_veggies

# Update .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/fresh_veggies"
```

### Step 6: Run Database Migrations (1 minute)
```bash
npm run db:push
```

You should see:
```
✓ Migrations applied successfully!
```

### Step 7: Start Development Server (30 seconds)
```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

🎉 **Success!** You should see the homepage with a beautiful hero section.

---

## 👤 Create First Admin User

### Method 1: Via Database (Recommended)

Connect to your database and run:

```sql
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'admin@freshveggies.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY2t6Zs.4QYOg7i',
  'Admin User',
  'admin'
);
```

**Login credentials:**
- Email: `admin@freshveggies.com`
- Password: `Admin@123`

### Method 2: Via Registration

1. Register a normal user at http://localhost:3000
2. Manually change the `role` to `admin` in database:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

---

## 🥬 Add Sample Vegetables

Run this SQL in your database to add sample vegetables:

```sql
INSERT INTO vegetables (name, slug, description, price, unit, stock, category, organic, featured, image_url, is_active)
VALUES 
  ('Organic Tomatoes', 'organic-tomatoes', 'Fresh, juicy organic tomatoes perfect for salads and cooking', '4.99', 'kg', 100, 'Vegetables', true, true, 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800', true),
  
  ('Fresh Carrots', 'fresh-carrots', 'Sweet and crunchy organic carrots rich in beta-carotene', '3.49', 'kg', 150, 'Vegetables', true, true, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800', true),
  
  ('Green Broccoli', 'green-broccoli', 'Nutritious green broccoli packed with vitamins', '5.99', 'kg', 80, 'Vegetables', true, false, 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800', true),
  
  ('Bell Peppers', 'bell-peppers', 'Colorful fresh peppers in red, yellow, and green', '6.49', 'kg', 120, 'Vegetables', false, true, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800', true),
  
  ('Baby Spinach', 'baby-spinach', 'Tender baby spinach leaves perfect for salads', '3.99', 'bag', 90, 'Leafy Greens', true, false, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800', true),
  
  ('Red Onions', 'red-onions', 'Fresh red onions with a mild sweet flavor', '2.99', 'kg', 200, 'Vegetables', false, false, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800', true),
  
  ('Cucumbers', 'cucumbers', 'Crisp and refreshing organic cucumbers', '4.49', 'kg', 110, 'Vegetables', true, true, 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800', true),
  
  ('Sweet Potatoes', 'sweet-potatoes', 'Nutrient-rich orange sweet potatoes', '5.49', 'kg', 85, 'Vegetables', true, false, 'https://images.unsplash.com/photo-1629888798959-32d8e7f0edbc?w=800', true);
```

---

## 🎨 Using the Application

### As a Customer

1. **Browse Products**
   - Go to http://localhost:3000
   - See featured vegetables on homepage
   - Scroll to view product grid

2. **Register/Login**
   - Click "Sign In" button in header
   - Click "Don't have an account? Sign up"
   - Fill in your details
   - Password requirements: min 8 chars, uppercase, lowercase, number

3. **Add to Cart**
   - Click the shopping cart icon on any product
   - View cart by clicking cart icon in header
   - Adjust quantities with +/- buttons
   - Remove items with trash icon

4. **Mobile Menu**
   - On mobile, click hamburger menu (≡)
   - Access all navigation links
   - View profile and orders

### As an Admin

1. **Access Admin Panel**
   - Login with admin credentials
   - Click "Admin" in navigation
   - Or go to: http://localhost:3000/admin

2. **View Dashboard**
   - See total products
   - Active products count
   - Out of stock items

3. **Add New Vegetable**
   - Click "Add Vegetable" button
   - Fill in all details:
     - Name (will auto-generate slug)
     - Description
     - Price and unit (kg/lb/piece/bunch/bag)
     - Stock quantity
     - Image URL (from Unsplash or your server)
     - Category
     - Mark as Organic/Featured
     - Set discount percentage
   - Click "Add Vegetable"

4. **Edit Vegetable**
   - Click edit icon (pencil) on any vegetable
   - Update any fields
   - Changes save automatically

5. **Delete Vegetable**
   - Click delete icon (trash)
   - Confirm deletion
   - (Soft delete - sets isActive to false)

---

## 🚀 Deploy to Vercel (5 Minutes)

### Step 1: Push to GitHub

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit: Fresh Veggies platform"

# Create GitHub repo and push
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository
4. Framework Preset: **Next.js** (auto-detected)
5. Click "Deploy"

### Step 3: Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
DATABASE_URL=your-production-postgres-url
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-app.vercel.app
```

### Step 4: Redeploy

After adding environment variables, trigger a new deployment.

### Step 5: Run Migrations

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Run migrations
npm run db:push
```

---

## 📂 Project Structure

```
fresh-veggies/
├── app/
│   ├── admin/
│   │   └── page.tsx              ← Admin panel
│   ├── api/
│   │   ├── auth/                 ← Login/Register
│   │   ├── cart/                 ← Cart management
│   │   ├── vegetables/           ← Public vegetable API
│   │   └── admin/                ← Admin vegetable CRUD
│   ├── layout.tsx                ← Root layout
│   └── page.tsx                  ← Homepage
├── components/
│   ├── AuthModal.tsx             ← Login/Register modal
│   ├── Button.tsx                ← Reusable button
│   ├── CartSidebar.tsx           ← Shopping cart
│   ├── Header.tsx                ← Navigation
│   ├── ProductCard.tsx           ← Product display
│   └── Skeleton.tsx              ← Loading skeletons
├── lib/
│   ├── db/
│   │   ├── schema.ts             ← Database schema
│   │   └── index.ts              ← DB connection
│   ├── auth.ts                   ← JWT + bcrypt
│   └── store.ts                  ← State management
├── styles/
│   └── globals.css               ← Design system
├── types/
│   └── index.ts                  ← TypeScript types
├── .env.example                  ← Environment template
├── package.json                  ← Dependencies
├── next.config.js                ← Next.js config
├── tailwind.config.js            ← Design tokens
└── vercel.json                   ← Vercel config
```

---

## 🔧 Available Commands

```bash
# Development
npm run dev          # Start dev server (port 3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio

# Linting
npm run lint         # Run ESLint
```

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### Database connection fails
- Check `DATABASE_URL` format is correct
- Ensure PostgreSQL is running
- Verify firewall allows connections
- Check SSL mode: add `?sslmode=require` for cloud databases

### "Invalid token" errors
- Ensure `JWT_SECRET` is set in `.env.local`
- Clear browser localStorage
- Try logging in again

### Build fails
- Check all environment variables are set
- Verify Node.js version (18+)
- Check build logs for specific errors

### Images not loading
- Verify image URLs are valid
- Check CORS settings if hosting images yourself
- Use Unsplash URLs for testing

---

## 📚 Documentation Files Included

1. **README.md** - Complete setup guide
2. **QUICKSTART.md** - 15-minute quick start
3. **PROJECT_SUMMARY.md** - Full project overview
4. **DEPLOYMENT.md** - Deployment checklist
5. **COMPLETION_CHECKLIST.md** - Feature checklist
6. **INSTALL.md** - This file

---

## 🎯 Features Overview

### User Features ✓
- User registration & login
- Browse vegetables
- Search & filter
- Add to cart
- Update quantities
- Persistent cart
- Responsive design
- Dark mode

### Admin Features ✓
- Complete admin panel
- Add vegetables
- Edit vegetables
- Delete vegetables
- Upload images
- Manage stock
- Set discounts
- Dashboard stats

### Technical Features ✓
- Next.js 14 (App Router)
- TypeScript
- PostgreSQL + Drizzle ORM
- JWT authentication
- Tailwind CSS
- Framer Motion animations
- Zustand state management
- Security best practices

---

## 🎊 You're All Set!

Your complete vegetable ordering platform is ready!

**Next Steps:**
1. ✅ Follow installation steps above
2. ✅ Create admin user
3. ✅ Add sample vegetables
4. ✅ Customize branding
5. ✅ Deploy to Vercel

**Need Help?**
- Check documentation files
- Review troubleshooting section
- Verify environment variables

**Time to get running:** ~15 minutes
**Time to deploy:** ~5 minutes

---

**Built with ❤️ following UI/UX best practices**
**Ready for production deployment**
**Mobile-first responsive design**
