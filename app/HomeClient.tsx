"use client";

import Image from "next/image";
import Partners from "@/components/Partners";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";

export default function HomeClient() {
  const paymentLogos = [
    { src: "/Visa_Brandmark_White_RGB_2021.png", alt: "Visa" },
    { src: "/mc_idcheck_hrz_pos_105px.png", alt: "Mastercard ID Check" },
    { src: "/mc_symbol_opt_73_3x.png", alt: "Mastercard Symbol" },
    { src: "/visa-secure_dkbg_blk_120dpi.jpg", alt: "Visa Secure" },
  ];

  return (
    <main style={{ backgroundColor: "#000", color: "#fff", position: "relative" }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="heroBgWrapper">
          <Image
            src="/IMG_0198.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={90}
            className="heroImg"
          />
        </div>
        <h1 className="heroTitle">Join the underground, wear the code.</h1>
      </section>

      {/* Our Partners */}
      <section className="section partners" style={{ textAlign: "center" }}>
        <h2 />
        <Partners />
      </section>

      {/* Video Section */}
      <section className="section flex flex-col items-center">
        <h3>
          Δες εδώ πώς δουλεύει το Customizer 👟✨
        </h3>

        <div className="videoWrapper">
          <video controls>
            <source src="/0914 (1).mp4" type="video/mp4" />
            Ο browser σας δεν υποστηρίζει το video.
          </video>
        </div>
      </section>

      {/* App Section */}
      <section className="section" style={{ textAlign: "center" }}>
        <h2>KZ Syndicate App</h2>
        <p>Κατέβασε την εφαρμογή μας για Android ή δες οδηγίες εγκατάστασης.</p>
        <a href="/app">⬇️ Download / Οδηγίες</a>
      </section>

      <Newsletter />
      <Contact />

      {/* Footer */}
      <footer>
        <h4>Payment Partners</h4>
        <div className="paymentLogos">
          {paymentLogos.map((logo) => (
            <div key={logo.src} className="logoWrapper">
              <Image src={logo.src} alt={logo.alt} width={120} height={40} />
            </div>
          ))}
        </div>
        <p>&copy; {new Date().getFullYear()} KZ Syndicate. All rights reserved.</p>
      </footer>

      {/* Styles */}
      <style jsx>{`
        main {
          background-color: #000;
          color: #fff;
          position: relative;
        }

        /* Hero */
        .hero {
          width: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
        .heroBgWrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 2746 / 1987;
          z-index: 0;
        }
        .heroImg {
          object-fit: contain;
          object-position: center;
        }
        .heroTitle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2rem;
          color: #010101ff;
          text-shadow: 0 0 8px #0ff, 0 0 16px #0ff;
          text-align: center;
          z-index: 1;
          margin: 0;
          padding: 0 1rem;
        }

        /* Sections */
        .section {
          padding: 4rem 0;
          text-align: center;
        }
        h2 {
          font-size: 1.8rem;
          color: #161818ff;
          text-shadow: 0 0 8px #0ff;
          margin-bottom: 1rem;
        }
        h3 {
          font-size: 1.2rem;
          color: #0ff;
          text-shadow: 0 0 6px #0ff, 0 0 12px #0ff;
          margin-bottom: 1rem;
        }
        p {
          opacity: 0.85;
          margin-bottom: 1.25rem;
        }
        a {
          display: inline-block;
          padding: 12px 18px;
          background: #00ffff;
          color: #000;
          font-weight: 800;
          border-radius: 12px;
          box-shadow: 0 0 14px #0ff;
          text-decoration: none;
        }

        /* Video */
        .videoWrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }
        video {
          width: 100%;
          height: auto;
          border-radius: 0.5rem;
          box-shadow: 0 0 14px #0ff;
        }

        /* Footer */
        footer {
          padding: 2rem 1rem;
          background-color: #000;
          text-align: center;
          border-top: 1px solid #0ff;
          margin-top: 2rem;
        }
        .paymentLogos {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .logoWrapper {
          width: 120px;
          height: 40px;
          display: inline-block;
          transition: filter 0.3s ease;
        }
        .logoWrapper:hover {
          filter: drop-shadow(0 0 8px #0ff);
        }
        footer p {
          color: #0ff;
          opacity: 0.6;
          margin-top: 1rem;
          font-size: 0.85rem;
        }

        /* Responsive */
        @media (max-width: 767px) {
          .heroTitle {
            font-size: 1rem;
            white-space: nowrap;
            line-height: 1.2;
            padding: 0;
          }
          .section {
            padding: 0.75rem 0;
          }
          h3 {
            font-size: 1rem;
          }
          .videoWrapper {
            max-width: 100%;
          }
        }
      `}</style>
    </main>
  );
}




