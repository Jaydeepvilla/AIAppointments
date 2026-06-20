# DentalAI Deployment Guide

This guide will help you deploy DentalAI to production using Vercel.

## Prerequisites

Before deploying, ensure you have:
- A GitHub repository with the DentalAI code
- A Vercel account (free tier available)
- A Neon PostgreSQL database
- An Anthropic API key (for Claude AI)
- A generated `BETTER_AUTH_SECRET`

## Step 1: Generate BETTER_AUTH_SECRET

Generate a secure secret key using OpenSSL:

```bash
openssl rand -base64 32
```

Save this value somewhere safe - you'll need it for environment variables.

## Step 2: Prepare Your Neon Database

1. Create a new project in Neon (https://neon.tech)
2. Get your DATABASE_URL from the Neon console
3. Format should be: `postgresql://user:password@host/database`

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select "Next.js" as the framework
5. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to connect your GitHub repo
```

## Step 4: Configure Environment Variables

In the Vercel Dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

```
DATABASE_URL=postgresql://user:password@host/database
BETTER_AUTH_SECRET=your_generated_secret_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Step 5: Set Up Database Migrations

After deployment, run migrations on your Neon database:

```bash
# Connect to your database
PGHOST=your_host PGUSER=your_user PGPASSWORD=your_password psql -d your_db

# Or if you have Drizzle CLI set up:
drizzle-kit push:pg
```

## Step 6: Test Your Deployment

1. Visit your Vercel deployment URL
2. Test the sign-up flow
3. Verify the chatbot is responding
4. Test the dashboard with test credentials

## Production Checklist

- [ ] Database URL is configured
- [ ] BETTER_AUTH_SECRET is set
- [ ] ANTHROPIC_API_KEY is configured
- [ ] SSL certificate is valid (Vercel handles this)
- [ ] Database backups are configured
- [ ] Environment is set to "Production" in Vercel
- [ ] Domain is custom (optional, can use vercel.app)
- [ ] CORS settings are configured if needed

## Scaling Considerations

### Database
- Neon provides auto-scaling for PostgreSQL
- Monitor query performance using Neon dashboard
- Consider connection pooling for high traffic

### API Rate Limiting
- Implement rate limiting for API endpoints
- Use Upstash Redis for distributed rate limiting (optional)
- Claude API has usage limits - monitor in Anthropic dashboard

### Caching
- Implement caching for frequently accessed data
- Use Vercel KV for distributed caching (optional)
- Enable CDN caching for static assets

## Monitoring & Debugging

### Vercel Analytics
1. In Vercel Dashboard, navigate to your project
2. Check "Analytics" for:
   - Request count
   - Response time
   - Error rate

### Logs
```bash
# View deployment logs
vercel logs [project-name]

# View runtime logs
# Available in Vercel Dashboard under "Functions"
```

### Database Monitoring
- Use Neon Dashboard to monitor:
  - Query performance
  - Connection count
  - Storage usage
  - Backup status

## Rollback Procedure

If you need to rollback to a previous version:

1. Go to Vercel Dashboard
2. Navigate to "Deployments"
3. Find the previous successful deployment
4. Click "Rollback"

## Custom Domain Setup

1. In Vercel Dashboard, go to Settings → Domains
2. Add your custom domain (e.g., dentalai.com)
3. Update DNS records with Vercel's nameservers or CNAME
4. Wait for DNS propagation (usually 24-48 hours)
5. Vercel automatically provisions SSL certificate

## Updating the Application

To deploy updates:

1. Push changes to your GitHub repository
2. Vercel automatically detects changes and deploys
3. New environment is automatically created for preview
4. Production updates after merge to main branch

```bash
# Local development
git checkout -b feature/your-feature
# Make changes
git push origin feature/your-feature

# Create Pull Request → Review → Merge
# Automatic deployment to production
```

## Troubleshooting

### Build Failures
- Check Vercel build logs
- Ensure all environment variables are set
- Verify dependencies are installed (no missing packages)
- Check TypeScript compilation errors

### Database Connection Issues
- Verify DATABASE_URL format
- Check Neon firewall rules
- Ensure database exists
- Test connection locally first

### Runtime Errors
- Check Vercel function logs
- Look for BETTER_AUTH_SECRET errors
- Verify API keys are valid
- Check rate limiting

### Performance Issues
- Monitor Vercel Analytics
- Check database query performance
- Enable caching where appropriate
- Consider upgrading Neon plan

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://www.better-auth.com)

## Security Considerations

1. **Never commit secrets** - Use environment variables
2. **HTTPS only** - Vercel handles this automatically
3. **SQL Injection** - Using Drizzle ORM prevents this
4. **CSRF Protection** - Better Auth handles this
5. **Session Security** - Use httpOnly cookies (default)

## Cost Estimation

### Monthly Costs (Approximate)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Pro | $20 |
| Neon | Paid | $0-50+ |
| Anthropic API | Usage-based | Variable |
| **Total** | | **$20-100+** |

Adjust based on your traffic and usage patterns.

---

For more help, see the [main README](./README.md) or contact support.
