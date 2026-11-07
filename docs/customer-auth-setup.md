# Customer authentication setup

The storefront remains publicly browsable. Customer authentication is available at `/login/` and is not required to view the catalogue.

## 1. Configure Supabase

Create or select the Supabase project that will own customer authentication. In the project settings, copy:

- Project URL
- Publishable key (or the legacy anon key)

Set these in local `.env.local` and GitHub repository Actions Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The browser receives only the publishable/anon key. Never expose a Supabase service-role key in frontend code, GitHub Pages artifacts, or `NEXT_PUBLIC_*` variables.

## 2. Enable email/password authentication

In Supabase Authentication settings, enable Email provider. Choose whether email confirmation is required. The registration screen handles both confirmation-required and immediately signed-in responses.

Add these allowed redirect URLs under Authentication URL Configuration:

- `https://vinitprajapat0822-coder.github.io/hari-ram-awpl-store/login/`
- `https://vinitprajapat0822-coder.github.io/hari-ram-awpl-store/reset-password/`
- `http://localhost:3000/hari-ram-awpl-store/login/`
- `http://localhost:3000/hari-ram-awpl-store/reset-password/`

Set the production Site URL to the GitHub Pages project URL:
`https://vinitprajapat0822-coder.github.io/hari-ram-awpl-store/`

## 3. Enable real Google sign-in

The login page uses Supabase OAuth with the Google provider. To activate it:

1. In Google Cloud Console, create an OAuth 2.0 Client ID for a Web application.
2. Add the GitHub Pages origin `https://vinitprajapat0822-coder.github.io` to Authorized JavaScript origins.
3. Add the Supabase callback URL shown on the Supabase Google provider setup screen (format: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`) to Authorized redirect URIs.
4. Paste the Google Client ID and Client Secret into the Supabase Authentication → Providers → Google configuration and enable the provider.
5. Save the provider configuration and test with a Google account.

Do not put the Google Client Secret in this repository or in a frontend environment variable. Google sign-in cannot complete until the Supabase provider is enabled and the redirect URLs are allow-listed.

## 4. GitHub Pages deployment

The deploy workflow reads the two `NEXT_PUBLIC_SUPABASE_*` values from GitHub Actions Variables at build time. Add both variables in the repository's Settings → Secrets and variables → Actions → Variables, then run the Pages deployment workflow.

The login UI can build without these values, but authentication will show a configuration notice until they are supplied.

## 5. Session behavior and security

- Supabase manages password verification and session tokens; this site never stores or logs raw passwords.
- "Remember me" stores the Supabase session in local storage when checked and session storage when unchecked.
- Google sign-in uses Supabase OAuth and redirects back to the store login route.
- Password reset sends a one-time Supabase email link and uses the dedicated `/reset-password/` page.
- The catalogue remains public. Authentication is not treated as proof of order, stock, payment or owner privileges.
