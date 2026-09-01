// Pings the IndexNow API (a single call fans out to every participating
// search engine: Bing, Yandex, Naver, Seznam — Google does not participate
// as of 2026, so this has no effect on Google indexing).
//
// Fire-and-forget by design: a failed or slow ping should never block or
// fail a post publish/edit.

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const HOST = "zeecomedia.net";

export async function pingIndexNow(urls: string[]) {
  if (!INDEXNOW_KEY || urls.length === 0) return;

  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/blog/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
  } catch {
    // Best-effort notification only — swallow errors.
  }
}