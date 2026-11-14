// Generates neutral placeholder "document" images for the sample cases, so the
// gallery can be tested before real photos are uploaded.

const TITLES: Record<string, string> = {
  judgment: 'JUDGMENT EXCERPT',
  seal: 'COURT SEAL',
  petition: 'PETITION FILING',
  order: 'ORDER SHEET',
  causelist: 'CAUSE LIST',
};

export async function GET(_req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const title = TITLES[type];
  if (!title) return new Response('Not found', { status: 404 });

  const lines = Array.from({ length: 13 }, (_, i) => {
    const y = 330 + i * 38;
    const width = i % 4 === 3 ? 420 : 760 - ((i * 53) % 110);
    return `<rect x="220" y="${y}" width="${width}" height="10" rx="2" fill="#CBD5E1"/>`;
  }).join('');

  const body =
    type === 'seal'
      ? `<circle cx="600" cy="520" r="190" fill="none" stroke="#0F172A" stroke-width="10"/>
         <circle cx="600" cy="520" r="150" fill="none" stroke="#0F172A" stroke-width="3"/>
         <circle cx="600" cy="520" r="96" fill="#0F172A"/>
         <text x="600" y="536" text-anchor="middle" font-family="Georgia, serif" font-size="44" fill="#FFFFFF">SEAL</text>`
      : lines;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <rect width="1200" height="900" fill="#E2E8F0"/>
  <rect x="150" y="50" width="900" height="800" fill="#FFFFFF"/>
  <rect x="150" y="50" width="900" height="120" fill="#0F172A"/>
  <text x="600" y="125" text-anchor="middle" font-family="Georgia, serif" font-size="40" letter-spacing="4" fill="#FFFFFF">${title}</text>
  <text x="600" y="235" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" letter-spacing="3" fill="#64748B">SAMPLE IMAGE — REPLACE WITH CASE PHOTO</text>
  <rect x="220" y="270" width="760" height="2" fill="#E2E8F0"/>
  ${body}
</svg>`;

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' },
  });
}
