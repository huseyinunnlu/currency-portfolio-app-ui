# GitHub Actions for Vercel Deployment

This repository contains GitHub Actions workflows for automated deployment to Vercel.

## Required Secrets

To use the Vercel deployment workflow, you need to add the following secrets to your GitHub repository:

1. `VERCEL_TOKEN` - Your Vercel API token
2. `VERCEL_ORG_ID` - Your Vercel Organization ID
3. `VERCEL_PROJECT_ID` - Your Vercel Project ID
4. `NEXT_PUBLIC_SOCKET_IO_URL` - Your Socket.IO server URL
5. `NEXT_PUBLIC_API_URL` - Your API URL

These environment variables match those in the `.env.example` file.

## How to Set Up Vercel Secrets

1. **Get Vercel Token**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to Settings → Tokens
   - Create a new token with appropriate permissions

2. **Get Organization and Project IDs**:
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel link` in your project directory
   - Find the IDs in the `.vercel/project.json` file created

3. **Add Secrets to GitHub**:
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add each secret with its corresponding value

## Workflow Details

The workflow will:
- Run on pushes to the prod-release branch and pull requests targeting prod-release
- Install dependencies
- Build the project with environment variables from secrets
- Deploy to Vercel using the provided credentials 