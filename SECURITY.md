# Security

This portfolio is a static client-side site. It has no accounts, database, server API, form submission, analytics, or secret-bearing runtime configuration.

The production deployment uses Cloudflare-managed HTTPS. Security headers in `client/public/_headers` restrict executable content and browser capabilities, prevent framing and MIME sniffing, limit referrer disclosure, and require HTTPS. Production dependencies are checked with `npm audit --omit=dev` before publication.

Please report suspected security issues privately through GitHub's security-reporting interface when available. Do not include credentials, personal information, or exploit details in a public issue.

If you deploy a modified copy, review the chosen host's headers, caching, dependency-update, and access policies separately. These controls reduce the attack surface but are not a claim that every third-party deployment is hardened.
