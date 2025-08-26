"use client";

export default function GDPRPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-6 text-cyan-400 drop-shadow-lg">
          GDPR – Προστασία Δεδομένων
        </h1>

        <p className="text-lg mb-4">
          Στην KZ Syndicate σεβόμαστε τα προσωπικά σας δεδομένα και
          δεσμευόμαστε να τα προστατεύουμε σύμφωνα με τον Γενικό Κανονισμό
          Προστασίας Δεδομένων (GDPR).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3 text-cyan-300">
          Δεδομένα που συλλέγουμε
        </h2>
        <p className="mb-4">
          - Email (για login και επικοινωνία) <br />
          - Custom σχέδια που αποθηκεύετε <br />
          - Αιτήματα τιμής (Price Requests)
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3 text-cyan-300">
          Δικαιώματά σας
        </h2>
        <p className="mb-4">
          Μπορείτε ανά πάσα στιγμή να ζητήσετε:
          <br />– Πρόσβαση στα δεδομένα σας <br />– Διόρθωση ή διαγραφή <br />–
          Διαγραφή λογαριασμού <br />– Διαγραφή αποθηκευμένων custom σχεδίων
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3 text-cyan-300">
          Επικοινωνία
        </h2>
        <p className="mb-4">
          Για οποιοδήποτε αίτημα σχετικά με τα προσωπικά σας δεδομένα, μπορείτε
          να επικοινωνήσετε στο{" "}
          <a
            href="mailto:info@kzsyndicate.com"
            className="text-cyan-400 underline"
          >
            info@kzsyndicate.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
