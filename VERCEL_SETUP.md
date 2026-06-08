# Vercel Setup Instructions - Quick Start

## 1️⃣ Connect Repository to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select `madan123051/Shop`
4. Click "Import"

## 2️⃣ Set Environment Variables

In Vercel dashboard → **Settings → Environment Variables**, add these:

**Required:**
```
DATABASE_URL=mysql://user:password@host:3306/newtech_db
JWT_SECRET=generate-a-random-secret-key
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Business Name
BUILT_IN_FORGE_API_URL=https://api.manus.im/forge
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im/forge
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
```

**Optional:**
```
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
VITE_APP_TITLE=New Tech Home Solutions
VITE_APP_LOGO=https://your-logo-url.png
```

## 3️⃣ Deploy

Click **Deploy** button and wait for build to complete.

## 4️⃣ Custom Domain (Optional)

1. Go to **Settings → Domains**
2. Add your domain
3. Update DNS records
4. SSL auto-generated

## ✅ Deployment Checklist

- [ ] GitHub repository connected
- [ ] All environment variables set
- [ ] Database configured
- [ ] Build successful
- [ ] Admin panel works at `/admin`
- [ ] Shopping cart functional
- [ ] Contact form working
- [ ] Custom domain configured (optional)

## 🔧 Build Configuration

- **Framework**: Vite
- **Build Command**: `pnpm build`
- **Output**: `dist`
- **Install**: `pnpm install`

## 📊 Database Options

### TiDB (Recommended)
- Sign up at https://tidbcloud.com
- Create cluster
- Get connection string
- Set as `DATABASE_URL`

### External MySQL
- Ensure Vercel IPs whitelisted
- Set connection string as `DATABASE_URL`

### PlanetScale
- Create database
- Get connection string
- Set as `DATABASE_URL`

## 🐛 Troubleshooting

**Build Fails:**
```bash
vercel logs --prod
```

**Database Connection Error:**
- Check `DATABASE_URL` is correct
- Verify database is running
- Whitelist Vercel IPs

**OAuth Not Working:**
- Verify `VITE_APP_ID`
- Check `OAUTH_SERVER_URL`
- Ensure redirect URI configured

## 📚 Full Guide

See `DEPLOYMENT.md` for complete setup guide.

## 🚀 After Deployment

1. Test all features in production
2. Set up monitoring
3. Configure custom domain
4. Set up CI/CD pipeline
5. Monitor performance

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Manus Docs: https://docs.manus.im
- GitHub Issues: https://github.com/madan123051/Shop/issues
