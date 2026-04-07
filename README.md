# IP Geolocator Zero

A fork of [IP Address & Geolocation](https://github.com/AykutCevik/Geolocate-IP-Browser-Extension) by [Aykut Çevik](https://aykutcevik.com), revived and improved for modern Firefox

The original extension intermittantly fails in Firefox seemingly because the developer's private backend servers (`ipv4.aykutcevik.com` / `ipv6.aykutcevik.com`) go down and/or have CORS restrictions that block Firefox extension origins (`moz-extension://`).

---

## What changed from the original

### API — replaced private backend with public fallback chain
The original relied entirely on Aykut's self-hosted servers. This fork replaces them with four well-known public geolocation APIs tried in order:

1. [ipinfo.io](https://ipinfo.io)
2. [ipapi.co](https://ipapi.co)
3. [ipwho.is](https://ipwho.is)
4. [freeipapi.com](https://freeipapi.com)

Each attempt has a 5 second timeout. If one fails or is unreachable, the next is tried automatically.

### Toolbar tooltip
Hovering the pinned extension icon now shows your current IP address instead of just the extension name.

### Firefox compatibility
- Replaced `service_worker` background with a background page (`background.html`) since Firefox handles background scripts differently
- Added `browser_specific_settings` with extension ID and `data_collection_permissions` required for Firefox addon store submission
- Removed `importScripts()` calls which are service worker-only APIs

### Cleanup
- Removed link to Aykut's Android app from the popup (unrelated to this fork)
- Updated GitHub link in popup to point to this repository
- Added `host_permissions` for all four API domains

---

## License

GNU General Public License v3.0 — same as the original. Original author: Aykut Çevik.


![chrome-extension](https://aykutcevik.com/blog/media/chrome-extension-screenshot-1.png)

Forked from Aykut Çevik's https://github.com/AykutCevik/Geolocate-IP-Browser-Extension
