"use client";

export default function DisclaimerPage() {
  return (
    <main className="bg-black text-white min-h-screen flex flex-col items-center px-6 py-16">
      {/* Tagline */}
      <section className="max-w-3xl text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 drop-shadow-lg mb-4">
          Be customised. Be unique.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
        
        </p>
      </section>

      {/* Disclaimer */}
      <section className="max-w-4xl bg-neutral-900 rounded-2xl shadow-lg shadow-cyan-500/30 p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-cyan-400">Νομική Δήλωση (Disclaimer)</h2>

        <p>
          Όλα τα εμπορικά σήματα, ονόματα και λογότυπα (Nike, Jordan, Adidas κ.λπ.) 
          ανήκουν στους αντίστοιχους ιδιοκτήτες τους. 
          Το <span className="font-semibold text-cyan-400">KZ Syndicate</span> 
          δεν συνδέεται, δεν εγκρίνεται και δεν συνεργάζεται επίσημα με καμία από αυτές τις εταιρείες.
        </p>

        <p>
          Όλα τα προϊόντα που παρουσιάζουμε είναι <span className="font-semibold">χειροποίητα custom έργα τέχνης</span>. 
          Τα sneakers αγοράζονται αυθεντικά από εξουσιοδοτημένους μεταπωλητές και στη συνέχεια 
          τροποποιούνται ανεξάρτητα από εμάς.
        </p>

        <p>
          Οι αναφορές σε brands (π.χ. Nike, Jordan) γίνονται αποκλειστικά για 
          να περιγράψουν το <span className="italic">βασικό προϊόν</span> πάνω στο οποίο εφαρμόζεται η custom εργασία. 
          Δεν υπάρχει καμία ένδειξη επίσημης συνεργασίας ή υποστήριξης.
        </p>

        <p>
          Οι πελάτες γνωρίζουν ότι αγοράζουν <span className="font-semibold">custom artwork</span>   
           και όχι προϊόν που παράγεται ή διανέμεται από την επίσημη μάρκα. 
          Το KZ Syndicate δεν φέρει ευθύνη για ζητήματα που σχετίζονται με την αρχική εταιρεία (π.χ. εγγύηση Nike).
        </p>
      </section>

      {/* Footer links (placeholder) */}
      <section className="mt-12 text-gray-400 text-sm space-x-4">
        <a href="/cookies" className="hover:text-cyan-400">Πολιτική Cookies</a>
        <a href="/gdpr" className="hover:text-cyan-400">GDPR</a>
      </section>
    </main>
  );
}
