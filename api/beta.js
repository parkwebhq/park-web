// Beta opt-in for parkweb.co/beta. Puts the address in Resend's "Park beta"
// segment, so beta emails go only to people who asked for the beta. Needs
// RESEND_API_KEY, a Full access key, in the Vercel project's environment.

const WAITLIST = "d80329a3-61d3-47f0-917c-9bb75a864671"; // Resend segment "Park waitlist"
const BETA = "6f760b46-1e23-4bb0-bae1-92e5102f718a";     // Resend segment "Park beta"

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

  // Resend takes the address itself in place of a contact id.
  const who = encodeURIComponent(email).replace(/%40/g, "@").replace(/%2B/g, "+");
  // Most people arrive from a waitlist email, so they're already contacts.
  let r = await resend(key, `/contacts/${who}/segments/${BETA}`);
  if (!r.ok) {
    // Not a contact yet, likely someone who joined after the last import: add them to both.
    r = await resend(key, "/contacts", { email });
    if (r.ok) r = await resend(key, `/contacts/${who}/segments/${WAITLIST}`);
    if (r.ok) r = await resend(key, `/contacts/${who}/segments/${BETA}`);
  }
  if (!r.ok) {
    console.error("Resend refused the beta opt-in:", r.status, (await r.text()).slice(0, 300));
    return res.status(502).json({ ok: false, error: "upstream" });
  }
  return res.status(200).json({ ok: true });
};

function parse(body) {
  if (body && typeof body === "object") return body;
  try { return JSON.parse(body || "{}"); } catch { return {}; }
}

// Resend allows a handful of requests a second per account, so a burst of clicks
// after an email can hit the limit. Wait as long as it asks, then try again.
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
