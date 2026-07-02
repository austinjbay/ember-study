# Connect Margin to Supabase Auth

The prototype now supports Supabase sessions, email magic links, Google OAuth, and logout. With no credentials configured, it remains in local demo mode.

## 1. Create a project

Create a project at [Supabase](https://supabase.com/dashboard), then open:

`Project Settings → Data API`

Copy:

- Project URL
- `anon` public key

Do not use the `service_role` key in this browser-based prototype.

## 2. Configure the prototype

Open `supabase-config.js` and add the public values:

```js
window.MARGIN_SUPABASE_CONFIG = {
  url: "https://YOUR_PROJECT.supabase.co",
  anonKey: "YOUR_PUBLIC_ANON_KEY"
};
```

## 3. Configure redirect URLs

In Supabase, open:

`Authentication → URL Configuration`

For local development, set the site URL or add a redirect URL matching the local server, for example:

```text
http://localhost:8000/
```

When the prototype is hosted, add the production URL as another allowed redirect.

## 4. Enable login methods

Email magic-link authentication is available through the email provider. To add Google:

1. Open `Authentication → Providers → Google`.
2. Create Google OAuth credentials.
3. Add the Supabase callback URL shown in the provider setup to Google’s authorized redirect URIs.
4. Add the Google client ID and secret in Supabase.
5. Enable the provider.

The Google secret belongs in Supabase, never in this repository.

## 5. Run locally

Serve the project over HTTP rather than opening `index.html` directly:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Current scope

Authentication is real once configured, but chapter and practice data still live in browser `localStorage`. The next integration phase should create user-owned database tables, Row Level Security policies, and private PDF storage before moving that data to Supabase.

## Production session policy

In Supabase, open the Auth session settings and configure:

- Inactivity timeout: `720h` (30 days)
- Time-box user sessions: `2160h` (90 days)
- Keep the default one-hour JWT expiry
- Keep refresh-token reuse detection enabled

The prototype includes a matching browser-side companion check and a “Log out of all devices” control. The Supabase settings are the authoritative enforcement layer and may require a paid plan.

## Deploy the V1 free-recall grading pipeline

The grading pipeline lives in `supabase/functions/grade-free-recall` and uses the migration in `supabase/migrations`.

Verified locally on July 1, 2026:

- `app.js` syntax check passes.
- Free-recall tests pass: `4 passed / 0 failed`.
- The edge function entrypoint type-checks.
- The Supabase project currently returns `404` for `free_recall_answer_keys` and `grade-free-recall`, which means the migration and edge function still need to be deployed.

The shortest deployment path is:

```bash
export SUPABASE_ACCESS_TOKEN="your-supabase-access-token"
export OPENAI_API_KEY="your-server-side-openai-key"
./scripts/deploy-free-recall.sh
```

Create the Supabase access token from:

`Supabase account menu → Access Tokens → Generate token`

Do not paste either token into chat or commit them to the repository.

After installing and authenticating the Supabase CLI:

```bash
supabase link --project-ref jwjcjpjbdhchmcocmkby
supabase db push
supabase secrets set OPENAI_API_KEY=YOUR_SERVER_SIDE_OPENAI_KEY
supabase secrets set OPENAI_GRADING_MODEL=gpt-5.4-mini
supabase functions deploy grade-free-recall
```

Never add the OpenAI key to `supabase-config.js` or any browser code.

Run the pipeline tests with:

```bash
deno test supabase/functions/grade-free-recall/free-recall.test.ts
```

Until the migration, secret, and function are deployed, the browser deliberately falls back to the existing directional prototype evaluator and labels that fallback with a toast.
