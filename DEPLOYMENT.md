# RoEscrow Deployment With Two Zip Files

You have two deployment packages:

- `deployment-zips/roescrow-bot-lunes.zip` for Lunes Host
- `deployment-zips/roescrow-website-vercel.zip` for Vercel

The bot and website connect through Supabase. Do not use local `transactions.json` for production.

## 1. Create Supabase Table

In Supabase, open SQL Editor and run:

```sql
create table if not exists public.roescrow_transactions (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roescrow_deal_requests (
  id text primary key,
  status text not null default 'pending',
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roescrow_reviews (
  id text primary key,
  featured boolean not null default false,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Copy these Supabase values for later:

- Project URL: `https://your-project-ref.supabase.co`
- Server-side key: use your Supabase secret/service role key

Do not put the Supabase key in frontend/browser code.

## 2. Deploy Bot To Lunes Host

Upload this zip to Lunes Host:

```text
deployment-zips/roescrow-bot-lunes.zip
```

After upload, extract it if Lunes does not extract automatically.

Set the Lunes environment variables:

```env
DISCORD_TOKEN=your_discord_bot_token
ROESCROW_VERIFICATION_URL=https://your-vercel-domain.vercel.app/verify
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SECRET_KEY=your_supabase_secret_or_service_role_key
ADMIN_PASSWORD=choose_a_strong_admin_password
```

Install dependencies if Lunes does not do it automatically:

```bash
npm install
```

Start command:

```bash
npm start
```

The bot will save each generated transaction to Supabase, then post the Discord embed with a verify button.

## 3. Deploy Website To Vercel

Upload/import this zip to Vercel:

```text
deployment-zips/roescrow-website-vercel.zip
```

Set the Vercel environment variables:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SECRET_KEY=your_supabase_secret_or_service_role_key
```

Use these Vercel build settings:

```text
Framework Preset: Other
Install Command: npm install
Build Command: npm run build
Output Directory: .vercel/output
```

Deploy or redeploy after adding the variables.

Your admin panel will be available at:

```text
https://your-real-vercel-domain.vercel.app/admin
```

## 4. Update Bot Website URL

After Vercel gives you the final website URL, update this Lunes variable:

```env
ROESCROW_VERIFICATION_URL=https://your-real-vercel-domain.vercel.app/verify
```

Restart the Lunes bot after changing it.

## 5. Test The Full Flow

1. Start the Lunes bot.
2. Wait for it to post a transaction in Discord.
3. Click the Discord `Verify Transaction` button.
4. It should open a URL like:

```text
https://your-real-vercel-domain.vercel.app/verify/ROESCROW-NM-123456
```

5. The website should auto-load the transaction details from Supabase.

## Security Notes

- Never upload `roescrow-bot/.env`.
- Never expose `SUPABASE_SECRET_KEY` in client-side code.
- If your Discord token was ever uploaded or shared, rotate it in the Discord Developer Portal.
