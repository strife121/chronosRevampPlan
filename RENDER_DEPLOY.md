# Indi redesign sizing: Render + Supabase

## Supabase

1. Create a free Supabase project.
2. Open **SQL Editor** and run:

```sql
create table if not exists public.sizing_documents (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
```

3. Copy these values from Supabase project settings:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

Use the **service_role** key only on the server. Do not paste it into the browser.

## Render

1. Push this repo to GitHub.
2. In Render, create a new **Blueprint** from the repo, or create a **Web Service** manually.
3. Use:

```text
Build Command: npm install
Start Command: npm start
```

4. Add environment variables:

```text
PRIVATE_LINK_TOKEN=<long-random-secret>
SUPABASE_URL=<your-supabase-project-url>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
SIZING_DOCUMENT_KEY=indi-redesign-sizing
```

`render.yaml` already declares a free web service and these env names. You still need to fill the secret values in Render.

## Private Link

Open the shared table by private link:

```text
https://<service>.onrender.com/?key=<long-random-secret>
```

## Behavior

- With `?key=...`, the table loads and saves one shared JSON document through `/api/sizing`.
- Without the key, the table works locally through browser `localStorage`.
- The key is not a login. Anyone with the link can edit the shared version.
- Supabase stores the shared JSON, so Render can run on the free plan without a persistent disk.
- Use the built-in JSON export as a backup before large edits.
