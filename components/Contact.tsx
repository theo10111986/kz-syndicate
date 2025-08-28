'use client';

import Image from 'next/image';
import qr from '../public/kzsyndicate_qr.png';

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        padding: '4rem 1rem',
        backgroundColor: '#000',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Contact Us</h2>

      <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
        📧 Email{' '}
        <a href="mailto:info@kzsyndicate.com" style={{ color: '#0ff' }}>
          info@kzsyndicate.com
        </a>
      </p>

      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        📱 Instagram{' '}
        <a
          href="https://instagram.com/kzsyndicate"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0ff' }}
          data-umami-event="Click Social"
          data-umami-event-platform="Instagram"
        >
          @kzsyndicate
        </a>
      </p>

      <a
        href="https://instagram.com/kzsyndicate"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-block', transition: 'transform 0.3s ease' }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        data-umami-event="Click Social"
        data-umami-event-platform="Instagram"
        data-umami-event-source="QR"
      >
        <Image
          src={qr}
          alt="KZ Instagram QR"
          width={140}
          height={140}
          style={{
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        />
      </a>
    </section>
  );
}
