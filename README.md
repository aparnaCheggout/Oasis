# Oasis Publishing House

A site for a translation and book layout business: services, a showcase of past work,
and a contact form for project inquiries. Built with Next.js + Sanity (content) + Resend
(contact form emails).

The site works out of the box with placeholder content — no accounts required to preview it.
Follow the steps below to connect real content and a real inbox.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Until Sanity is connected (below), pages show sample/placeholder
content so you can see the layout immediately.

## Connect Sanity (so the site owner can edit content without code)

1. Create a free account at [sanity.io](https://www.sanity.io) and run:
   ```bash
   npx sanity@latest init
   ```
   Choose "Create new project", pick a project name, and select the **production** dataset.
   When it asks about a schema/template, you can skip — this repo already has one in
   `src/sanity/schemaTypes/`.
2. Copy `.env.local.example` to `.env.local` and fill in the project ID it gave you:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
3. Restart `npm run dev`, then open http://localhost:3000/studio — that's the content editor.
   Add:
   - **Site Settings** (one document): business name, tagline, bio, contact email/phone
   - **Service** documents: Translation, Layout & Design, Bundle (or whatever you're offering)
   - **Showcase Item** documents: each translated book or layout project, with a cover image
   - **Testimonial** documents (optional): quotes from past clients
4. When you deploy (see below), give the site owner the `/studio` URL on the live site —
   that's their permanent editing dashboard. No code access needed.

## Connect the contact form (so inquiries land in an inbox)

1. Create a free account at [resend.com](https://resend.com) and generate an API key.
2. Add to `.env.local`:
   ```
   RESEND_API_KEY=your-resend-api-key
   CONTACT_EMAIL=the-inbox-that-should-receive-inquiries@example.com
   ```
3. By default this uses Resend's shared sending address (`onboarding@resend.dev`), which only
   delivers to the email you signed up to Resend with. To receive inquiries at your real
   business inbox, verify your own domain in Resend and change the `from` address in
   `src/app/api/contact/route.ts`.

Without these two env vars set, the contact form still works end-to-end in the browser, but
submissions are only logged to the server console instead of emailed — useful for testing the
UI before wiring up real email.

## Deploying

The easiest path is [Vercel](https://vercel.com):
1. Push this repo to GitHub.
2. Import it in Vercel, add the same environment variables from `.env.local` in the Vercel
   project settings.
3. Deploy. `/studio` on the deployed URL is the live content editor.

## Project structure

- `src/app/` — pages (home, services, showcase, about, contact) and the `/api/contact` route
- `src/sanity/schemaTypes/` — the content model editable in `/studio`
- `src/lib/content.ts` — fetches content from Sanity, falling back to `src/lib/sampleData.ts`
  when Sanity isn't configured yet
- `src/components/` — shared Header, Footer, and the contact form
