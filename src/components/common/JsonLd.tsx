// components/JsonLd.tsx
"use client";

import Head from "next/head";

interface Props {
  data: Record<string, any>;
}

export default function JsonLd({ data }: Props) {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
}
