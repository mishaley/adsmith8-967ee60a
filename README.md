# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/72899787-be20-4b79-9d16-ee156377c2bb

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/72899787-be20-4b79-9d16-ee156377c2bb) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/72899787-be20-4b79-9d16-ee156377c2bb) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

# Setting up Google Ads Integration

## Database Setup

1. Run the database migrations:

```bash
supabase migration up
```

## Edge Function Deployment

1. Deploy the Google Ads OAuth Edge Function:

```bash
supabase functions deploy google-ads-oauth-token
```

2. Set up the necessary secrets for the Edge Function:

```bash
supabase secrets set GOOGLE_ADS_CLIENT_ID=your_client_id
supabase secrets set GOOGLE_ADS_CLIENT_SECRET=your_client_secret
supabase secrets set GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
supabase secrets set GOOGLE_ADS_REDIRECT_URI=https://your-app-url.com/oauth/callback
```

## Environment Variables

Create a `.env` file based on the `.env.example` template:

```
# Supabase 
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Ads
VITE_GOOGLE_ADS_CLIENT_ID=your_google_ads_client_id
VITE_GOOGLE_ADS_MANAGER_CUSTOMER_ID=your_manager_customer_id

# Environment
VITE_ENV=development
```

## Usage

The Google Ads integration allows you to:

1. Connect to Google Ads accounts using OAuth
2. Store and manage connection credentials securely in Supabase
3. Select different connected accounts for campaign management
