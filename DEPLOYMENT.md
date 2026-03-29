# 🚀 Deployment Checklist for Fresh Veggies

## Pre-Deployment

### 1. Code Review
- [ ] All components split from AllComponents.tsx into individual files
- [ ] No console.log statements in production code
- [ ] All TODO comments addressed
- [ ] Error boundaries implemented
- [ ] Loading states added everywhere

### 2. Environment Variables
- [ ] `.env.example` copied to `.env.local`
- [ ] `DATABASE_URL` configured
- [ ] `JWT_SECRET` generated (min 32 chars)
- [ ] `NEXTAUTH_SECRET` generated
- [ ] `NEXTAUTH_URL` set correctly

### 3. Database
- [ ] PostgreSQL database created
- [ ] Migrations run successfully (`npm run db:push`)
- [ ] Seed data added (admin user + sample vegetables)
- [ ] Database connection tested

### 4. Security
- [ ] All API routes have authentication checks
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] CSRF tokens in place
- [ ] SQL injection prevention (using Drizzle ORM)
- [ ] XSS prevention (input sanitization)

### 5. Testing
- [ ] User registration works
- [ ] User login works
- [ ] Add to cart works
- [ ] Cart persistence works
- [ ] Admin panel accessible
- [ ] CRUD operations for vegetables work
- [ ] Mobile responsive on all screens
- [ ] Dark mode works
- [ ] Skeleton loaders display correctly

## Vercel Deployment

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Fresh Veggies platform"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Create Vercel Project
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Framework Preset: **Next.js** (auto-detected)
4. Root Directory: `./`
5. Build Command: `npm run build` (default)
6. Output Directory: `.next` (default)

### 3. Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

**Production:**
- `DATABASE_URL` = Your production Postgres URL
- `JWT_SECRET` = Your secure JWT secret
- `NEXTAUTH_URL` = https://your-app.vercel.app
- `NEXTAUTH_SECRET` = Your secure NextAuth secret

**Preview & Development:**
- Same variables but with development database URL

### 4. Vercel Postgres (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Create Postgres database
vercel postgres create fresh-veggies-db

# Connect to project
vercel env pull .env.local
```

### 5. Deploy
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 6. Post-Deployment
- [ ] Run database migrations on Vercel
- [ ] Test all features on production URL
- [ ] Set up custom domain (optional)
- [ ] Configure SSL/TLS (automatic with Vercel)

## Performance Optimization

### Before Launch
- [ ] Run Lighthouse audit (target: 90+)
- [ ] Optimize images (WebP/AVIF format)
- [ ] Enable compression in Vercel
- [ ] Configure caching headers
- [ ] Test on slow 3G connection
- [ ] Check Core Web Vitals

### Monitoring
- [ ] Set up Vercel Analytics
- [ ] Configure error tracking (Sentry optional)
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation

## SEO & Metadata

- [ ] Add proper meta tags
- [ ] Create `robots.txt`
- [ ] Create `sitemap.xml`
- [ ] Add Open Graph images
- [ ] Configure Twitter Cards
- [ ] Test with Google Search Console

## Accessibility

- [ ] Screen reader tested
- [ ] Keyboard navigation works
- [ ] Color contrast checked (4.5:1 minimum)
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Alt text for all images

## Security Headers

Already configured in `next.config.js`:
- [x] X-Content-Type-Options
- [x] X-Frame-Options
- [x] X-XSS-Protection
- [x] Referrer-Policy
- [x] Permissions-Policy
- [x] Strict-Transport-Security

## Backup & Recovery

- [ ] Database backups configured
- [ ] Backup strategy documented
- [ ] Disaster recovery plan
- [ ] Version control up to date

## Documentation

- [ ] README.md complete
- [ ] API documentation written
- [ ] Component documentation added
- [ ] Deployment guide finalized
- [ ] User guide created (optional)

## Legal & Compliance

- [ ] Privacy policy added
- [ ] Terms of service added
- [ ] Cookie consent (if applicable)
- [ ] GDPR compliance (if EU users)
- [ ] Data retention policy

## Marketing

- [ ] Social media accounts created
- [ ] Launch announcement prepared
- [ ] Press kit ready
- [ ] Support email configured

## Support

- [ ] Customer support email set up
- [ ] FAQ page created
- [ ] Contact form working
- [ ] Help documentation available

---

## Quick Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server locally
npm start

# Database migrations
npm run db:generate
npm run db:push

# Deploy to Vercel
vercel --prod
```

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Database Connection Issues
- Check `DATABASE_URL` format
- Ensure SSL mode is correct
- Verify firewall rules
- Test connection with `psql` command

### Environment Variables Not Working
- Redeploy after adding new variables
- Check variable names match exactly
- Ensure no trailing spaces in values

---

**Last Updated:** $(date)
**Version:** 1.0.0
