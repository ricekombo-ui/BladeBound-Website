# Beta access prototype — not yet a playable app

This branch only contains a standalone tester login and feedback form. It does not contain or protect the separate character app. Do not invite players or use real data until the character app is securely hosted, access is integrated, and both systems have passed end-to-end security checks.

## Isolation and configuration

1. Create a **separate** Supabase project for beta testing, if an unused free project is available. Never use the existing AMC project. The public URL must be different from `NEXT_PUBLIC_SUPABASE_URL`.
2. In the isolated beta project's SQL editor, review and run `supabase/migration_beta.sql` once. Do not run it in the AMC project. The existing `schema.sql` also includes the beta schema for source documentation; do not run the whole AMC schema in the beta project.
3. In the website's Vercel project, add `NEXT_PUBLIC_BETA_SUPABASE_URL` and `NEXT_PUBLIC_BETA_SUPABASE_ANON_KEY` with the isolated beta project's public URL and publishable/anon key. Add them to Preview only for initial testing; add Production only before a separately approved launch. They are public client settings, not service-role secrets. Never put the service-role key in a `NEXT_PUBLIC_` variable.
4. Supabase Auth's default email service cannot invite arbitrary external email addresses. Configure an appropriate email provider and allowlisted redirect URLs before using emailed invitations. A complete invitation, password setup, and recovery flow is not implemented here. An administrator can create test accounts in the beta project's Auth dashboard for controlled prototype testing.
5. For each test account, insert its UUID into `public.beta_members` using the beta project's SQL editor. Delete that row to revoke access. Existing beta sessions are denied at the next membership check. Never use a shared tester account.
6. Review submitted feedback in the isolated project's `beta_feedback` table with administrator access. Tester accounts can insert but cannot read or update feedback. The database limits each tester to five submissions per hour.
7. Visit the Vercel preview after the environment is configured. Verify unauthenticated access is denied, invited access works, revocation takes effect, feedback and the database rate limit work, and AMC accounts and data are inaccessible from the beta project. Vercel SSO may block external users from preview deployments. Real beta access requires additional work and separate approval.

Supabase Auth supplies login throttling; verify its settings and limits on the isolated project. Free projects can pause and do not include automatic backups. The existing AMC policy risks remain unresolved. No database, user accounts, secrets, or preview environment were changed by this branch.
