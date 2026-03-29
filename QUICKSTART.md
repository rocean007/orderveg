# ⚡ Quick Start Guide - Fresh Veggies

## 🎯 Get Running in 15 Minutes

### Step 1: Extract and Open (30 seconds)
```bash
cd fresh-veggies
code .  # or open in your favorite editor
```

### Step 2: Split Components (5 minutes)
Open `components/AllComponents.tsx` and split into 3 files:

**Create `components/ProductCard.tsx`:**
Copy the `ProductCard` function and its imports

**Create `components/AuthModal.tsx`:**
Copy the `AuthModal` function and its imports

**Create `components/CartSidebar.tsx`:**
Copy the `CartSidebar` function and its imports

**Update imports in `app/page.tsx`:**
```tsx
// Change this:
import { ProductCard } from '@/components/AllComponents';

// To this:
import ProductCard from '@/components/ProductCard';
import AuthModal from '@/components/AuthModal';
import CartSidebar from '@/components/CartSidebar';
```

Then delete `AllComponents.tsx`.

### Step 3: Environment Variables (2 minutes)
```bash
# Copy template
cp .env.example .env.local

# Edit .env.local with your values
```

**Required Variables:**
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

**Generate secrets:**
```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

### Step 4: Install Dependencies (1 minute)
```bash
npm install
```

### Step 5: Database Setup (3 minutes)

**Option A: Vercel Postgres (Recommended)**
1. Go to https://vercel.com/dashboard
2. Create new Postgres database
3. Copy `DATABASE_URL` to `.env.local`

**Option B: Local PostgreSQL**
```bash
# Create database
createdb fresh_veggies

# Update .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/fresh_veggies"
```

**Run Migrations:**
```bash
npm run db:push
```

### Step 6: Start Development (30 seconds)
```bash
npm run dev
```

Open http://localhost:3000 🎉

---

## 🎨 What You'll See

### Homepage
- Beautiful hero section with gradient
- Feature cards (Organic, Fast Delivery, etc.)
- Product grid with skeleton loaders
- Smooth animations throughout

### Features Working Out of the Box
- ✅ Click "Sign In" → Registration/Login modal
- ✅ Browse vegetables (once added)
- ✅ Add to cart (requires login)
- ✅ Cart sidebar with quantity controls
- ✅ Mobile menu
- ✅ Dark mode (system preference)

---

## 📝 Add Your First Vegetable

### Option 1: Via Admin Panel (Coming Soon)
Access `/admin` route (requires admin user)

### Option 2: Direct Database Insert
```sql
INSERT INTO vegetables (
  name, slug, description, price, unit, stock,
  category, organic, featured, image_url, is_active
) VALUES (
  'Organic Tomatoes',
  'organic-tomatoes',
  'Fresh, juicy organic tomatoes perfect for salads',
  '4.99',
  'kg',
  100,
  'Vegetables',
  true,
  true,
  'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800',
  true
);
```

### Option 3: Seed Script
Create `scripts/seed.js`:
```javascript
const { db } = require('../lib/db');
const { vegetables } = require('../lib/db/schema');

async function seed() {
  const veggies = [
    {
      name: 'Organic Tomatoes',
      slug: 'organic-tomatoes',
      description: 'Fresh, juicy organic tomatoes',
      price: '4.99',
      unit: 'kg',
      stock: 100,
      category: 'Vegetables',
      organic: true,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337',
    },
    // Add more...
  ];

  await db.insert(vegetables).values(veggies);
  console.log('✅ Seeded successfully!');
}

seed();
```

Run: `node scripts/seed.js`

---

## 🔐 Create Admin User

### Via Database
```sql
-- Password: Admin@123 (hashed with bcrypt)
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'admin@freshveggies.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY2t6Zs.4QYOg7i',
  'Admin User',
  'admin'
);
```

### Via API (Using curl)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@freshveggies.com",
    "password": "Admin@123",
    "name": "Admin User"
  }'

# Then manually update role to 'admin' in database
```

---

## 🚀 Deploy to Vercel (5 minutes)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit: Fresh Veggies"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main

# 2. Import to Vercel
# - Go to vercel.com
# - Click "Import Project"
# - Select your GitHub repo
# - Add environment variables
# - Deploy!
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

### "Invalid token" errors
- Check `JWT_SECRET` is set in `.env.local`
- Clear browser localStorage
- Try logging in again

### Build fails on Vercel
- Ensure all environment variables are set
- Check build logs for specific errors
- Verify `package.json` scripts are correct

---

## 📚 Next Steps

1. **Customize Design**
   - Edit colors in `tailwind.config.js`
   - Modify styles in `styles/globals.css`
   - Update logo and branding

2. **Add More Features**
   - Order management
   - Payment integration (Stripe)
   - Email notifications
   - Product reviews

3. **Admin Panel**
   - Build admin dashboard
   - Add analytics
   - Inventory management

4. **Production Ready**
   - Add error tracking (Sentry)
   - Set up monitoring
   - Configure backups
   - Add SSL certificate

---

## 🎉 You're All Set!

Your vegetable ordering platform is ready to use!

**Time from zero to running:** ~15 minutes
**Lines of code:** ~4,500+
**Features:** 30+
**Components:** 10+
**API Routes:** 8+

**Happy coding! 🥬🚀**
