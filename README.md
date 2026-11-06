# SaveWise

Savings and allowance tracker. Plain HTML + CSS + JavaScript, no install or build step.
One page per HTML file. Phones get the mobile layout; computers get a full website layout (sidebar + wide grids).

## Pages
index.html (splash) - intro.html, intro2.html, intro3.html - login.html - signup.html
home.html - expenses.html - goals.html - needwant.html - later.html - challenges.html - reports.html - profile.html

## Files
- css/styles.css  all design, mobile first, desktop layout from 900px wide
- js/core.js      shared code (data, icons, sidebar, bottom nav, popups)
- js/<page>.js    one script per page
- manifest.webmanifest, sw.js, icon.svg  installable + offline

## Run in VS Code
1. File > Open Folder > this folder.
2. Install the extension "Live Server".
3. Right-click index.html > Open with Live Server.
Phone preview: press F12 in the browser, click the phone icon. On the same Wi-Fi you can open http://YOUR-PC-IP:5500 on a real phone.

## Publish free
Netlify Drop (https://app.netlify.com/drop): drag the whole folder. Or GitHub Pages / Vercel / Cloudflare Pages.

## Install like an app
Android Chrome: menu > Install app. iPhone Safari: Share > Add to Home Screen. Desktop Chrome/Edge: install icon in the address bar.

## Limits
- Accounts and data are saved only in each device's browser (localStorage). Phone and laptop do not share data.
- Cash in is a manual record, not a real payment.
- Real sync across devices needs a backend (Firebase/Supabase). For Play Store / App Store, wrap with Capacitor.
