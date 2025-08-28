// app/custom/page.tsx
export const metadata = {
  title: "Custom Options | KZ Syndicate",
  description: "Διάλεξε πώς θέλεις να ξεκινήσεις το customization σου.",
};

import CustomClient from "./CustomClient";

export default function CustomPage() {
  return <CustomClient />;
}
