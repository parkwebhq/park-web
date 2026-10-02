// Park waitlist: the site's form posts here and each sign-up becomes a row
// in the Sheet this script is bound to. File > Download > CSV for the list.

const SHEET_NAME = "Waitlist";

function doPost(e) {
  const p = (e && e.parameter) || {};
  const email = String(p.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
    return reply({ ok: false, error: "invalid" });
  }

  // One writer at a time, so two sign-ups in the same second both land.
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet();
    const last = sheet.getLastRow();
    if (last > 1) {
      const known = sheet.getRange(2, 2, last - 1, 1).getValues().flat();
      if (known.includes(email)) return reply({ ok: true });   // already on the list
    }
    sheet.appendRow([new Date(), email, String(p.source || "").slice(0, 200)]);
    return reply({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(["Joined", "Email", "Source"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
