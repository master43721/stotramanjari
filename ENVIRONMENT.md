# Production environment variables

Set these as **Production** environment variables in Vercel. None is prefixed
with `NEXT_PUBLIC_`, so none is sent to browsers.

| Variable | Required for | Notes |
| --- | --- | --- |
| `DEVDARSHA_API_KEY` | DevDarsha Panchang data | Keep it server-only. Rotate any key that was pasted into chat or a local file. |
| `ADMIN_PASSWORD` | Private `/admin-login` | Use a unique long password. |
| `ADMIN_SESSION_SECRET` | Private admin sessions | Generate with `openssl rand -base64 48`. |
| `RESEND_API_KEY` | Contact-form delivery | Create with Resend after verifying the sender domain. |
| `CONTACT_FROM_EMAIL` | Contact-form delivery | A verified Resend sender, e.g. `Stotramani <contact@your-domain>`. |
| `CONTACT_TO_EMAIL` | Contact-form delivery | The private mailbox that should receive inquiries. |

The Panchang route and contact route return an honest unavailable/configuration
response when their optional providers are not configured. They never expose
their provider credentials to the client.
