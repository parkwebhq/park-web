// Waitlist sign-ups from the home page. Puts the address in Resend's "Park waitlist"
// segment, so the waitlist emails reach new sign-ups without an import. The page sends
// each sign-up to the Google Sheet too, which keeps where it came from. Needs
// RESEND_API_KEY, a Full access key, in the Vercel project's environment.

const WAITLIST = "d80329a3-61d3-47f0-917c-9bb75a864671"; // Resend segment "Park waitlist"

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method" });
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ ok: false, error: "not_configured" });

  const body = parse(req.body);
  if (body.company) return res.status(200).json({ ok: true });   // a bot filled the hidden field
  const email = String(body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
    return res.status(400).json({ ok: false, error: "invalid" });
  }

  // Resend takes the address itself in place of a contact id. Making the contact fails
  // harmlessly for someone already in Resend; either way, adding it to the segment decides.
  const who = encodeURIComponent(email).replace(/%40/g, "@").replace(/%2B/g, "+");
  const made = await resend(key, "/contacts", { email });
  const r = await resend(key, `/contacts/${who}/segments/${WAITLIST}`);
  if (!r.ok) {
    console.error("Resend refused the waitlist sign-up:", made.status, r.status, (await r.text()).slice(0, 300));
    return res.status(502).json({ ok: false, error: "upstream" });
  }
  return res.status(200).json({ ok: true });
};

function parse(body) {
  if (body && typeof body === "object") return body;
  try { return JSON.parse(body || "{}"); } catch { return {}; }
}

// Resend allows a handful of requests a second per account, so a burst of sign-ups
// can hit the limit. Wait as long as it asks, then try again.
async function resend(key, path, data, tries = 3) {
  const r = await fetch("https://api.resend.com" + path, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined
  });
  if (r.status === 429 && tries > 1) {
    const wait = Math.min(Number(r.headers.get("retry-after")) || 1, 5);
    await new Promise(done => setTimeout(done, wait * 1000));
    return resend(key, path, data, tries - 1);
  }
  return r;
}
