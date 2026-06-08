# Vercel Deployment Guide

## Prerequisites

1. **GitHub Repository**: Code is already pushed to `https://github.com/madan123051/Shop`
2. **Vercel Account**: Sign up at https://vercel.com
3. **Database**: MySQL database (TiDB or external provider)
4. **Environment Variables**: All required secrets from Manus

## Step 1: Connect GitHub to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select `madan123051/Shop`
4. Click "Import"

## Step 2: Configure Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

```
DATABASE_URL=mysql://user:password@host:3306/database_name
JWT_SECRET=your-jwt-secret
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name
BUILT_IN_FORGE_API_URL=https://api.manus.im/forge
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im/forge
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id
VITE_APP_TITLE=New Tech Home Solutions
VITE_APP_LOGO=https://your-logo-url.png
```

## Step 3: Configure Build Settings

- **Framework**: Vite (auto-detected)
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

## Step 4: Deploy

Click **Deploy** button. Vercel will:
1. Clone the repository
2. Install dependencies
3. Build the project
4. Deploy to production

## Step 5: Configure Custom Domain (Optional)

1. Go to **Settings → Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate will be auto-generated

## Step 6: Set Up Automatic Deployments

Vercel automatically deploys on:
- Push to `main` branch
- Pull request merges

## Environment Variables Explanation

| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | MySQL connection string | ✅ Yes |
| `JWT_SECRET` | Session signing key | ✅ Yes |
| `VITE_APP_ID` | Manus OAuth App ID | ✅ Yes |
| `OAUTH_SERVER_URL` | Manus OAuth endpoint | ✅ Yes |
| `VITE_OAUTH_PORTAL_URL` | Manus login portal | ✅ Yes |
| `OWNER_OPEN_ID` | Admin user ID | ✅ Yes |
| `BUILT_IN_FORGE_API_KEY` | Manus API key | ✅ Yes |
| `VITE_FRONTEND_FORGE_API_KEY` | Frontend API key | ✅ Yes |
| `VITE_APP_TITLE` | Website title | ❌ No |
| `VITE_APP_LOGO` | Logo URL | ❌ No |

## Troubleshooting

### Build Fails
- Check Node.js version compatibility
- Verify all environment variables are set
- Check database connection

### Runtime Errors
- Check server logs in Vercel dashboard
- Verify database is accessible from Vercel
- Check environment variables are correct

### Database Connection Issues
- Ensure database allows connections from Vercel IPs
- For TiDB: Add Vercel IPs to whitelist
- For external DB: Configure firewall rules

## Monitoring

- **Vercel Analytics**: Dashboard shows deployment history
- **Error Tracking**: Check Function Logs for server errors
- **Performance**: Monitor build times and function duration

## Rollback

To rollback to previous deployment:
1. Go to **Deployments** tab
2. Find previous deployment
3. Click **Promote to Production**

## Support

For issues:
- Check Vercel documentation: https://vercel.com/docs
- Review server logs in Vercel dashboard
- Contact Manus support for OAuth/API issues
