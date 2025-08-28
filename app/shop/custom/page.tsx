// app/shop/custom/page.tsx
export const metadata = {
  title: "Custom Yourself | KZ Syndicate",
  description: "Επίλεξε υποκατηγορία (Angelus, Πρόσθετα & Προεργασία) για να ξεκινήσεις.",
};

import CustomClient from "./CustomClient";

export default function CustomLandingPage() {
  return <CustomClient />;
}

