// app/shop/custom/page.tsx
export const metadata = {
  title: "Custom Yourself | KZ Syndicate",
  description: "Διάλεξε υποκατηγορία (Angelus, Πρόσθετα/Προεργασία) και ξεκίνα το customization σου.",
};

import CustomClient from "./CustomClient";

export default function CustomLandingPage() {
  return <CustomClient />;
}
