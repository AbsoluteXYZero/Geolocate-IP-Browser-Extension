# IP Geolocator Zero

A fork of [IP Address & Geolocation](https://github.com/AykutCevik/Geolocate-IP-Browser-Extension) by [Aykut Çevik](https://aykutcevik.com), revived and improved for modern Firefox

The original extension intermittantly fails in Firefox seemingly because the developer's private backend servers (`ipv4.aykutcevik.com` / `ipv6.aykutcevik.com`) go down and/or have CORS restrictions that block Firefox extension origins (`moz-extension://`).

---

### API — replaced private backend with public fallback chain
The original relied entirely on Aykut's self-hosted servers. This fork replaces them with two well-known public geolocation APIs tried in order:

1. [freeipapi.com](https://freeipapi.com) — primary
2. [ipinfo.io](https://ipinfo.io) — fallback

### IP change detection
- Checks your IP every 4 seconds via [api.ipify.org](https://api.ipify.org) — a lightweight service designed for high-volume checks
- Hits the geo API only when your IP actually changes

### In-browser notification banner
When your IP changes, a floating banner appears in the top-right corner of your active tab showing the old and new IP. Fades out after 5 seconds.

### Toolbar tooltip
Hovering the pinned extension icon shows your current IP address instead of just the extension name.

### Firefox compatibility
- Replaced `service_worker` background with a background page (`background.html`) since Firefox handles background scripts differently
- Added `browser_specific_settings` with extension ID and `data_collection_permissions` required for Firefox addon store submission
- Removed `importScripts()` calls which are service worker-only APIs

### Cleanup
- Removed IPv6 lookup — the replacement APIs don't have separate IPv6 endpoints so it was dead weight
- Removed link to Aykut's Android app from the popup
- Updated GitHub link in popup to point to this repository
- Removed duplicate alarm listener from original code

---

## License

GNU General Public License v3.0 — same as the original. Original author: Aykut Çevik.


![chrome-extension](https://aykutcevik.com/blog/media/chrome-extension-screenshot-1.png)

Forked from Aykut Çevik's https://github.com/AykutCevik/Geolocate-IP-Browser-Extension
