# Waitlist setup

Sign-ups go to a Google Sheet. About 10 minutes, once.

1. Make a new Google Sheet. Name it "Park waitlist".
2. **Extensions › Apps Script.** Delete what's there, paste in `Code.gs`, save.
3. **Deploy › New deployment.** Click the gear, pick **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Deploy. Google asks you to allow access to your Sheets. Allow it.
5. Copy the **Web app URL** (ends in `/exec`).
6. In `index.html`, paste it into `WAITLIST_ENDPOINT`.

The first sign-up makes a "Waitlist" tab with Joined, Email and Source.
Repeat emails are ignored. For a CSV: **File › Download › Comma-separated values**.

If you change `Code.gs` later, use **Deploy › Manage deployments › Edit ›
New version**, so the URL stays the same.
