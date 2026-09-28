# Docusaurus contact form — Formspree alternative with AI spam filtering

Add a contact form to your [Docusaurus](https://docusaurus.io) site backed by
[SmartForm AI](https://usesmartform.com).

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
## Related examples
[Vite + React contact form](https://github.com/yanghuai123456/smartform-example-vite-react) | [Astro contact form](https://github.com/yanghuai123456/smartform-example-astro) | [Vite + Vue 3 contact form](https://github.com/yanghuai123456/smartform-example-vite-vue)


## FAQ

### Why use this instead of Formspree?

Both SmartForm and Formspree let you POST a plain HTML form to a hosted
endpoint with no backend. SmartForm adds an AI spam filter (not just
honeypots), AI intent classification (`sales` / `support` / `inquiry`)
and high-value lead detection, with a free tier that includes the spam
filter. Formspree charges per submission; SmartForm's spam filter is
free on every plan.

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

