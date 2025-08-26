"use client";
import { useState, useEffect } from "react";

export default function CookiesPage() {
  const [accepted, setAccepted] = useState<boolean | null>(null);

  // Διάβασε αποθηκευμένη επιλογή
  useEffect(() => {
    const stored = localStorage.getItem("cookiesAccepted");
    if (stored !== null) {
      setAccepted(stored === "true");
    }
  }, []);

  // Αποθήκευσε επιλογή
  const handleChoice = (choice: boolean) => {
    setAccepted(choice);
    localStorage.setItem("cookiesAccepted", choice.toString());
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-gray-900 rounded-2xl shadow-lg p-8 border border-cyan-400">
        <h1 className="text-3xl font-bold mb-6 text-cyan-400">Πολιτική Cookies</h1>

        <p className="mb-4 text-gray-300">
          Τα cookies είναι μικρά αρχεία κειμένου που αποθηκεύονται στη συσκευή σας
          όταν επισκέπτεστε τον ιστότοπό μας. Χρησιμοποιούμε cookies για να
          διασφαλίσουμε την ομαλή λειτουργία του καταστήματος, να θυμόμαστε τις
          προτιμήσεις σας και να βελτιώνουμε την εμπειρία σας.
        </p>

        <h2 className="text-xl font-semibold text-cyan-400 mb-2">Απαραίτητα cookies</h2>
        <p className="mb-4 text-gray-300">
          Είναι αναγκαία για τη βασική λειτουργία του site, όπως το καλάθι, το
          login και η αποθήκευση προτιμήσεων. Δεν μπορούν να απενεργοποιηθούν.
        </p>

        <h2 className="text-xl font-semibold text-cyan-400 mb-2">Αναλυτικά cookies</h2>
        <p className="mb-4 text-gray-300">
          Χρησιμοποιούνται για στατιστικά και ανάλυση χρήσης (π.χ. Google
          Analytics). Μας βοηθούν να κατανοήσουμε πώς χρησιμοποιείτε τον ιστότοπο
          ώστε να βελτιώνουμε την εμπειρία σας.
        </p>

        <h2 className="text-xl font-semibold text-cyan-400 mb-2">Επιλογές σας</h2>
        <p className="mb-6 text-gray-300">
          Έχετε τη δυνατότητα να αποδεχθείτε ή να απορρίψετε τα μη απαραίτητα
          cookies. Μπορείτε να αλλάξετε την επιλογή σας ανά πάσα στιγμή μέσω αυτής
          της σελίδας.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => handleChoice(true)}
            className="flex-1 bg-cyan-500 text-black py-2 rounded-lg hover:bg-cyan-400 transition"
          >
            Αποδοχή
          </button>
          <button
            onClick={() => handleChoice(false)}
            className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Απόρριψη
          </button>
        </div>

        {accepted !== null && (
          <p className="mt-6 text-sm text-gray-400">
            Επιλογή σας:{" "}
            <span className="text-cyan-400">
              {accepted ? "Αποδοχή μη απαραίτητων cookies" : "Απόρριψη μη απαραίτητων cookies"}
            </span>
          </p>
        )}
      </div>
    </main>
  );
}
