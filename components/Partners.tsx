export default function Partners() {
  const partners = [
     { src: '/logos/mitchell.png', url: 'https://www.mitchellandness.com/en/' },
     { src: '/logos/nike.jpg', url: 'https://www.nike.com' },
    { src: '/logos/logo1.png', url: 'https://instagram.com/shoesservice.gr' },
    { src: '/logos/logo2.png', url: 'https://instagram.com/creait_wear' },
    { src: '/logos/logo3.png', url: 'https://www.instagram.com/john_parza/' },
   { src: '/logos/logo4.png', url: 'https://www.instagram.com/angelusshoepolish/' },
  ];

  return (
    <div style={{ backgroundColor: '#000', padding: '3rem 0', overflow: 'hidden' }}>
      <h2
        style={{
          textAlign: 'center',
          fontSize: '1.5rem',
          color: '#00ffff',
          textShadow: '0 0 10px #00ffff',
          marginBottom: '2rem',
        }}
      >
        Our Partners
      </h2>

      <div
        style={{
          display: 'flex',
          gap: '3rem',
          width: 'max-content',
          animation: 'scrollLeft 30s linear infinite',
          paddingLeft: '100%',
        }}
      >
        {partners.map((partner, i) => (
          <a
            key={i}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <img
              src={partner.src}
              alt={`logo-${i}`}
              style={{
                height: '60px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 8px cyan)',
                transition: 'transform 0.3s',
              }}
              onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </a>
        ))}
      </div>

      <style jsx>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
