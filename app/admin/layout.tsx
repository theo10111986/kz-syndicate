// app/admin/layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Κανένα extra header/nav εδώ — απλώς αποδίδουμε το περιεχόμενο της κάθε σελίδας
  return <>{children}</>;
}
