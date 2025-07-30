import { NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { fetchBusinessData, getSitemapDetails } from '@/utils/api.utils';
import { generatePages } from '@/utils/common.util';

export async function GET() {
    const xml: any = await getSitemapDetails();
    // Build XML
    // const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueUrls
    //     .map(
    //         url => `  <url>\n    <loc>${SITE_URL}${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    //     )
    //     .join('\n')}\n</sitemapindex>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
