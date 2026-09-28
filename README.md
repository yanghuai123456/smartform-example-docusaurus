# Docusaurus contact form — Formspree alternative with AI spam filtering

Add a contact form to your [Docusaurus](https://docusaurus.io) site backed by
[SmartForm AI](https://usesmartform.com).

## What you're POSTing

The endpoint accepts a standard HTML form POST or JSON via AJAX. Two
kinds of fields:

**Your form fields** — `name`, `email`, `message`, whatever you
want. Every non-reserved field lands in your dashboard as a column in
the submissions table.

**Reserved fields** — names starting with `_` are interpreted by
the API, not stored:

| Field | Purpose |
|---|---|
| ``_gotcha`` | **Honeypot.** Keep it empty. Hidden from humans via CSS; bots fill it automatically. Any non-empty value silently drops the submission. Add this to every form. |
| ``_hp_email`` / ``_website`` / ``_url`` / ``_phone`` | Honeypot aliases for `_gotcha` (WordPress / WPForms / Contact Form 7 migrations). Same drop semantics. |
| ``_next`` | Same-origin URL to redirect to after a successful submission. Browser POST results in a 302 here. AJAX calls (with `Accept: application/json`) get the same value back as `next_url` in the JSON response. Only http(s) and in-site paths allowed. |
| ``_subject`` | Override the AI-generated email subject line. Max 200 chars; control characters stripped. |
| `X-Gotcha` header | Same as `_gotcha` for JSON requests where you can't add a hidden form field. |

Field names are Formspree-compatible — migrating from
`formspree.io/f/{form_id}` requires no renaming.

## Setup

1. Get a form ID at https://usesmartform.com/dashboard.
2. Clone, install, configure, run:
   ```bash
   git clone https://github.com/yanghuai123456/smartform-example-docusaurus.git
   cd smartform-example-docusaurus
   npm install
   # edit docusaurus.config.js → smartformFormId: 'f_your_real_id'
   npm start
   ```
3. Open http://localhost:3000/contact, submit, check your dashboard.

## The form

`src/pages/contact.tsx` is a React form that POSTs to SmartForm as JSON (so the page
shows an inline status message instead of navigating away).

```tsx
import { useState } from 'react';

export default function Contact() {
  const [status, setStatus] = useState('');
  const formId = require('@docusaurus/core/lib/noop').DEFAULT_CONFIG.smartformFormId
              || (typeof process !== 'undefined' && process.env.SMARTFORM_FORM_ID)
              || 'f_replace_me';

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('Sending…');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const r = await fetch(`https://api.usesmartform.com/api/v1/f/${formId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await r.json();
      setStatus(`Sent! submission_id=${body.submission_id} intent=${body.intent}`);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input name="name"  placeholder="Name"  required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required />
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off"
             style={{ position: 'absolute', left: -9999 }} aria-hidden />
      <button type="submit">Send</button>
      <p>{status}</p>
    </form>
  );
}
```

## How the API works

- `POST https://api.usesmartform.com/api/v1/f/{form_id}` — JSON or form-data, no API key.
- Response: `{ success, message, submission_id, is_spam, intent, next_url }`.

For the full contract, see https://usesmartform.com/docs.

## Deploy

```bash
npm run build          # static output in ./build
# Push ./build to Netlify / Cloudflare Pages / GitHub Pages
```


## FAQ

### Is there a free tier?

Yes. AI spam filtering is enabled by default on every plan. AI intent
classification and high-value lead detection require a paid plan (Pro
or Business) — the dashboard enforces this and returns HTTP 402 if
you try to enable them on a free workspace.

### Do I need an API key?

No. The form posts directly to a public endpoint using only an 8-char
form ID, which is non-enumerable. The example also includes a hidden
`_gotcha` honeypot field so naive bots cannot submit.

### Will this work with my docs site?
Yes. The example adds a `contact.md` MDX page plus a React contact component; both render through the standard Docusaurus 3 build.

## Related examples
[Vite + React contact form](https://github.com/yanghuai123456/smartform-example-vite-react) | [Astro contact form](https://github.com/yanghuai123456/smartform-example-astro) | [Vite + Vue 3 contact form](https://github.com/yanghuai123456/smartform-example-vite-vue)


## License

MIT.

