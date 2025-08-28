export const metadata = {
  title: "Επικοινωνία | KZ Syndicate",
  description: "Επικοινώνησε με το KZ Syndicate για custom παραγγελίες σε sneakers, ρούχα και αξεσουάρ.",
};

import Contact from '@/components/Contact';

export default function ContactPage() {
  return (
    <main style={{ padding: '3rem 1rem', minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '2rem',
        textShadow: '1px 1px 4px rgba(0,0,0,0.7)'
      }}>
        Contact the Syndicate
      </h1>
      
      <Contact />
    </main>
  );
}
