// Serves /ads.txt for Google AdSense account authorization.
// Auto-generated from NEXT_PUBLIC_ADSENSE_CLIENT (e.g. ca-pub-1234...).
// Returns empty until the publisher id is configured.

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  if (!client) {
    return new Response("", {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
  }
  const pub = client.replace(/^ca-/, ""); // ads.txt uses pub-XXXX, not ca-pub-XXXX
  const body = `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`;
  return new Response(body, {
    status: 200,
    headers: { "content-type": "text/plain" },
  });
}
