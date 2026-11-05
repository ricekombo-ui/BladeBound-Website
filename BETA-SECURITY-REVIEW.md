# Private character-app beta: initial review

This is a review of repository code, not a live database audit or a deployed beta. Do not invite testers until the live configuration and complete application have been independently verified.

## Findings requiring attention

- `supabase/schema.sql` defines permissive policies on internal tables including `tasks`, `check_ins`, `decisions`, and `checkin_tokens`. If those policies and suitable API grants exist in the live project, users may be able to access data directly through the Supabase API without passing through the website's middleware. Verify current policies and grants without changing production. The checked-in schema alone cannot establish what is deployed or what was accessed.
- `/amc` middleware checks for a signed-in Supabase user, not an AMC role or membership. Adding new testers to the same Auth project could allow them into AMC; some giveaway data is also available to authenticated users according to the schema.
- The daily submission endpoint uses a service-role client, whose database requests bypass RLS. Its token verification does not reject `used_at`, and task and subtask updates are selected by submitted ID without an ownership filter. Verify and address these as a separate security change, with tests for replay and cross-user edits.
- Contact and giveaway endpoints accept anonymous writes and lack an application-level throttle; policies may also permit direct inserts. Investigate abuse controls and quotas.
- The app uses a SQLite file and local private uploads. A Vercel function's filesystem is ephemeral, so deploying the existing app as-is would not provide safe shared durable storage. A complete database and uploads migration or another suitable host is needed.
- The original website is on a branch where production deploys automatically from `main`. Never merge a partial beta gate or point preview variables at production data without an explicit review. Preview protection is Vercel SSO and does not itself test the intended tester access.
- Free Supabase projects may pause, have quota and email delivery limits, and do not provide the same managed backup options as paid plans. Test restoration separately.
- Current repo search found no sitemap or robots route. Exclusion from navigation and indexing requires verification of the final implementation and deployment. `noindex` is not access control.
- Review rights for game content, third-party text, and extracted art before hosting. The existing public site promotes paid services; verify how the intended use and the hosting provider's plan terms apply.

## Proposed boundary

Use individually invited, revocable identities isolated from AMC. A separate beta Supabase Auth project avoids creating accounts in the existing internal project's trust domain. The character app must enforce its own authorization on every data request; a gated landing page is not protection for an independently reachable app. The existing app's authentication and campaign invitations need a deliberate integration or migration, with abuse protection, isolation, revocation, feedback, and data migration tests. No secret or live data belongs in this repository.

The intended group is at least six unpaid testers in the owner's gaming groups. Confirm whether games themselves are paid before relying on noncommercial hosting or content-license assumptions. Design and cost must be checked against current provider terms and account quotas.
