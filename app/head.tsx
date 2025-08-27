// app/head.tsx
export default function Head() {
  const base = "https://www.kzsyndicate.com";
  const img = `${base}/kz-og.JPG`; // η εικόνα μας 1200x630 JPG

  return (
    <>
      <meta property="og:title" content="KZ Syndicate" />
      <meta property="og:description" content="Join the underground, wear the code." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={base} />

      <meta property="og:image" content={img} />
      <meta property="og:image:secure_url" content={img} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="KZ Syndicate" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="KZ Syndicate" />
      <meta name="twitter:description" content="Join the underground, wear the code." />
      <meta name="twitter:image" content={img} />
    </>
  );
}
