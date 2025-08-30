"use client";

import { useEffect, useState } from "react";

export default function GetAppPage() {
  const [platform, setPlatform] = useState<"android" | "ios" | "desktop">("desktop");

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/android/.test(ua)) setPlatform("android");
    else if (/iphone|ipad|ipod/.test(ua)) setPlatform("ios");
    else setPlatform("desktop");
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "3rem 1.5rem",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: 700,
          width: "100%",
          border: "2px solid #00ffff",
          borderRadius: "1rem",
          boxShadow: "0 0 20px #0ff",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#00ffff", textShadow: "0 0 10px #0ff", marginBottom: "1rem" }}>
          Κατέβασε την εφαρμογή KZ Syndicate
        </h1>

        {platform === "android" && (
          <>
            <p style={{ opacity: 0.85, marginBottom: "1rem" }}>
              ⚡ Android: Εγκατάστησε απευθείας το αρχείο APK.
            </p>

            <a
              href="/app/kzsyndicate-android.apk"
              download
              style={{
                display: "inline-block",
                padding: "12px 18px",
                background: "#00ffff",
                color: "#000",
                fontWeight: 800,
                borderRadius: 12,
                boxShadow: "0 0 14px #0ff",
                textDecoration: "none",
              }}
            >
              ⬇️ Download APK
            </a>

            <div style={{ textAlign: "left", marginTop: 18, fontSize: 14, opacity: 0.9 }}>
              <p>Οδηγίες (μία φορά):</p>
              <ol style={{ lineHeight: 1.6 }}>
                <li>Άνοιξε το αρχείο που κατέβηκε (Downloads).</li>
                <li>Αν σου ζητήσει, επίτρεψε “Install unknown apps”.</li>
                <li>Άνοιξε την εφαρμογή — τρέχει full-screen.</li>
              </ol>
            </div>
          </>
        )}

        {platform === "ios" && (
          <>
            <p style={{ opacity: 0.85, marginBottom: "1rem" }}>
              📱 iPhone/iPad: τα APK δεν υποστηρίζονται. Μπορείς να προσθέσεις την web-app στην αρχική οθόνη:
            </p>
            <ol style={{ textAlign: "left", margin: "0 auto", maxWidth: 520, lineHeight: 1.6 }}>
              <li>Άνοιξε το <b>kzsyndicate.com</b> στο Safari.</li>
              <li>Πάτησε <b>Share</b> → <b>Add to Home Screen</b>.</li>
              <li>Άνοιξέ την από το εικονίδιο (full-screen).</li>
            </ol>
          </>
        )}

        {platform === "desktop" && (
          <>
            <p style={{ opacity: 0.85, marginBottom: "1rem" }}>
              💻 Από υπολογιστή μπορείς να κατεβάσεις το APK και να το περάσεις σε Android συσκευή,
              ή να εγκαταστήσεις την PWA από τον browser (Install/Εγκατάσταση).
            </p>
            <a
              href="/app/kzsyndicate-android.apk"
              download
              style={{
                display: "inline-block",
                padding: "12px 18px",
                background: "#00ffff",
                color: "#000",
                fontWeight: 800,
                borderRadius: 12,
                boxShadow: "0 0 14px #0ff",
                textDecoration: "none",
              }}
            >
              ⬇️ Download APK
            </a>
          </>
        )}
      </div>
    </main>
  );
}
