import React, { useEffect, useMemo, useRef, useState } from 'react'

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const ref = useRef(null);

  useEffect(() => {
    // We are selecting the element here to avoid issues with the ref not being ready.
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Add 'is-visible' class when the element is intersecting
        if (entry.isIntersecting) {
          element.classList.add('is-visible');
          observer.unobserve(element); // Optional: Stop observing after it's visible
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    observer.observe(element);

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []);

  return ref;
};


export default function App() {
  // --- Replace these with your real links, API key and address
  const SOCIALS = useMemo(() => ({
    instagram: 'https://www.instagram.com/pearlsyarniverse?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    tiktok: 'https://www.tiktok.com/@pearlsyarniverse?is_from_webapp=1&sender_device=pc',
    whatsapp: 'https://wa.me/27711470844', // South Africa intl format e.g., 27711470844
    email: 'mailto:dylanmndlovu@gmail.com' // <-- Add your business email here
  }), [])

  // --- IMPORTANT: Replace with your actual Google Maps Embed API Key ---
  // You can get one from the Google Cloud Console.
  const GOOGLE_MAPS_EMBED_API_KEY = 'AIzaSyBDn1G9BC3PbNyJC3NPm5PzCWsso84XkBM'
  const BUSINESS_ADDRESS = 'Railway Street, Ladanna, Polokwane, Limpopo, South Africa'

  // --- Gallery images (replace with your work)
  const galleryImages = useMemo(() => [
    { src: './main/src/1.jpg', alt: 'Purple bucket Hat' },
    { src: './src/2.jpg', alt: 'Stylish person wearing a ruffle hat' },
    { src: '/src/3.jpg', alt: 'Baby blue ruffle hat' },
    { src: '/main/src/4.jpg', alt: 'Handmade crochet scrunchies' },
    { src: 'src/5.jpg', alt: 'Person wearing baby blue ruffle hat' },
    { src: 'src/6.jpg', alt: 'Person wearing black and white cat hat' },
    { src: 'src/7.jpg', alt: 'Pearl wearing red and white slouchy hat' },
    { src: 'src/8.jpg', alt: 'Black and grey cat hat packaged' },
    { src: 'src/9.jpg', alt: 'Black and white scrunchy' },
    { src: 'src/10.jpg', alt: 'Purple and white scrunchy' },
    { src: 'src/11.jpg', alt: 'Purple and Blue ruffle hat' },
    { src: 'src/12.jpg', alt: 'Purple scrunchy' },
  
  
  ], [])

  // --- Lightbox
  const [lightbox, setLightbox] = useState({ open: false, index: 0 })
  const openLightbox = (idx) => setLightbox({ open: true, index: idx })
  const closeLightbox = () => setLightbox({ open: false, index: 0 })
  const nextImage = () => setLightbox((l) => ({ ...l, index: (l.index + 1) % galleryImages.length }))
  const prevImage = () => setLightbox((l) => ({ ...l, index: (l.index - 1 + galleryImages.length) % galleryImages.length }))

  useEffect(() => {
    function onKey(e) {
      if (!lightbox.open) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox.open, galleryImages.length])

  // --- Mobile nav toggle
  const [navOpen, setNavOpen] = useState(false)
  const toggleNav = () => setNavOpen((v) => !v)
  const closeNav = () => setNavOpen(false)

  // --- Active link highlighting
  const sections = ['Home', 'About', 'Services', 'Videos', 'Gallery', 'Contact']
  const [active, setActive] = useState('home')
  useEffect(() => {
    const observers = []
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(id)
          })
        },
        { rootMargin: '-50% 0px -50% 0px' } // Highlights when the section is in the middle of the screen
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <>
      <Header navOpen={navOpen} toggleNav={toggleNav} active={active} closeNav={closeNav} />

      <main>
        <Hero />
        <About />
        <Services />
        <Videos />
        <Gallery images={galleryImages} onOpen={openLightbox} />
        <Contact socials={SOCIALS}/>
      </main>

      <Footer
        socials={SOCIALS}
        apiKey={GOOGLE_MAPS_EMBED_API_KEY}
        address={BUSINESS_ADDRESS}
      />

      <FloatingSocials socials={SOCIALS} />

      <Lightbox
        open={lightbox.open}
        image={galleryImages[lightbox.index]}
        onClose={closeLightbox}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </>
  )
}

/* ------------------------- Header / Nav ------------------------- */

function Header({ navOpen, toggleNav, active, closeNav }) {
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'videos', label: 'Videos'},
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ]
  return (
    <header className="site-header">
      <div className="container header-content">
        <a href="#home" className="brand" onClick={closeNav}>
          {/* --- Smaller logo image --- */}
          <img
            src="src/pearlsLogo.png"
            alt="Pearl's Yarniverse Logo"
            style={{ width: 40, height: 40, objectFit: 'contain', marginRight: 8 }}
          />
          
          <span className="brand-name">Pearl's Yarniverse </span>
        </a>

        <button className={`hamburger ${navOpen ? 'is-active' : ''}`} onClick={toggleNav} aria-label="Toggle navigation">
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav ${navOpen ? 'open' : ''}`}>
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'active' : ''} onClick={closeNav}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

/* --------------------------- Sections -------------------------- */

function Hero() {
  const sectionRef = useScrollAnimation();
  return (
    <section id="home" className="section hero" ref={sectionRef}>
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1>
            Pearl's <span className="accent">Yarniverse</span>
          </h1>
          <p>
            A cozy corner of the universe where fibre art meets love and care.
            Our mission is to provide quality, handmade products crafted with the finest materials for our customers. Explore our collection:
          </p>
          <ul className="hero-highlights">
            <li>Cat Beanies</li>
            <li>Ruffle Hats</li>
            <li>Classic Beanies</li>
            <li>Bucket Hats</li>
            <li>Slouchy Beanies</li>
            <li>Granny Square Hats</li>
            <li>Scrunchies & More</li>
          </ul>
        </div>
        <div className="hero-art">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          {/* --- Replace with your own video file or embed link --- */}
          <div style={{
            width: '300px',
            height: '300px',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff'
          }}>
            <video
              className="hero-video"
              src="src/5.mp4" // Replace with your video URL
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '0.5rem'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  const sectionRef = useScrollAnimation();
  return (
    <section id="about" className="section section-animated" ref={sectionRef}>
      <div className="container">
        <div className="about-grid">
            <div className="about-story">
                <div className="section-head">
                    <h2>Our Story</h2>
                </div>
                <p>
                    Pearl's Yarniverse was founded by Kamogelo "Pearl" Chipape, a passionate crocheter with a vision to share the joy of yarn crafting with the world. What started as a hobby quickly blossomed into a mission to create beautiful, high-quality, and cozy fibre art that brings warmth and style to everyone.
                </p>
                <p>
                    Every piece is made with love, care, and a meticulous attention to detail, ensuring that you receive a product that is not only beautiful but also durable and comfortable. We believe in the magic of handmade items and the personal touch they bring.
                </p>
            </div>
            <div className="about-image-wrapper">
                {/* --- Replace with a picture of the founder or workspace --- */}
                <img src="main/src/pearlsLogo.png" alt="A person crocheting with colorful yarn"/>
            </div>
        </div>
        <div className="values-section">
            <div className="section-head">
                <h2>Our Values</h2>
                <p>Craftsmanship, creativity, and customer delight are at the heart of every stitch.</p>
            </div>
            <div className="values-grid">
              <div className="about-card">
                <h3>Quality</h3>
                <p>We only use the finest, softest materials to ensure our products are cozy and long-lasting.</p>
              </div>
              <div className="about-card">
                <h3>Creativity</h3>
                <p>We believe everyone has a creative spark. We are here to inspire it with unique designs and custom options.</p>
              </div>
              <div className="about-card">
                <h3>Community</h3>
                <p>We are building a community of like-minded crafters and fashion lovers who share our passion for yarn and crochet.</p>
              </div>
            </div>
        </div>
      </div>
    </section>
  )
}

function Services() {
  const sectionRef = useScrollAnimation();
  const items = [
    {
      title: 'Ready-to-Ship Products',
      desc: 'Browse our collection of handmade beanies, hats, and accessories, ready to be shipped to your doorstep.',
      icon: '🛍️'
    },
    {
      title: 'Custom Orders',
      desc: 'Have a unique idea? We love bringing your vision to life! Contact us for custom colors, sizes, and designs.',
      icon: '🎨'
    },
    {
      title: 'Pearl Luxe Be',
      desc: 'Check our sister company on social media pages where we specialise in lash installations of all shapes and sizes.',
      icon: '💄'
    },
  ]
  return (
    <section id="services" className="section section-animated" ref={sectionRef}>
      <div className="container">
        <div className="section-head">
          <h2>What We Offer</h2>
          <p>Handcrafted with love, just for you.</p>
        </div>
        <div className="card-grid">
          {items.map((s) => (
            <article className="card" key={s.title}>
              <span className="card-icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Videos() {
  const sectionRef = useScrollAnimation();
  // --- IMPORTANT: Replace these with your actual video embed URLs ---
  // To get an embed URL from YouTube, click "Share" then "Embed" on a video.
  const knittingVideos = [
    "src/2.mp4", // Placeholder
    "src/1.mp4"  // Placeholder
  ];
  const lashesVideos = [
    "src/4.mp4", // Placeholder
    "src/7.mp4"  // Placeholder
  ];

  return (
    <section id="videos" className="section section-animated" ref={sectionRef}>
      <div className="container">
        <div className="section-head">
          <h2>Videos</h2>
          <p>See our work.</p>
        </div>
        <div className="video-section">
          <h3>Knitting ,Crochet & Fun</h3>
          <div className="video-grid">
            {knittingVideos.map((videoSrc, index) => (
              <div className="video-wrapper" key={`knitting-${index}`}>
                <video
                  src={videoSrc}
                  title={`Knitting Video ${index + 1}`}
                  autoPlay
                  loop
                  muted
                  controls
                  style={{ width: '100%', borderRadius: '0.5rem' }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="video-section">
          <h3>More</h3>
          <div className="video-grid">
            {lashesVideos.map((videoSrc, index) => (
              <div className="video-wrapper" key={`lashes-${index}`}>
                <video
                  src={videoSrc}
                  title={`Lashes Video ${index + 1}`}
                  autoPlay
                  loop
                  muted
                  controls
                  style={{ width: '100%', borderRadius: '0.5rem' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function Gallery({ images, onOpen }) {
  const sectionRef = useScrollAnimation();
  return (
    <section id="gallery" className="section section-animated" ref={sectionRef}>
      <div className="container">
        <div className="section-head">
          <h2>Gallery</h2>
          <p>A showcase of our recent creations.</p>
        </div>
        <div className="gallery-grid">
          {images.map((img, i) => (
            <button
              key={i}
              className="gallery-item"
              onClick={() => onOpen(i)}
              aria-label={`Open image ${i + 1}`}
            >
              <img src={img.src} alt={img.alt} loading="lazy" />
              <span className="glow"></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact({ socials }) {
  const sectionRef = useScrollAnimation();
  return (
    <section id="contact" className="section section-animated" ref={sectionRef}>
      <div className="container contact-grid">
        <div className="contact-details">
          <div className="section-head">
            <h2>Get In Touch</h2>
            <p>Ready for a custom order or have a question? Contact us!</p>
          </div>
          <ul className="contact-points">
            <li>
                <strong>Email:</strong> 
                <a href={socials.email}>pearlsyarniverse@example.com</a>
            </li>
            <li>
                <strong>WhatsApp:</strong> 
                <a href={socials.whatsapp} target="_blank" rel="noreferrer">+27 71 147 0844</a>
            </li>
            <li><strong>Based in:</strong> Polokwane, Limpopo</li>
          </ul>
        </div>
        <div className="contact-image-wrapper">
            {/* --- Replace with an inviting image of your products --- */}
            <img src="src/8.jpg" alt="A stack of colorful, handmade crochet hats."/>
        </div>
      </div>
    </section>
  )
}

/* --------------------------- Footer & Map --------------------------- */

function Footer({ socials, apiKey, address }) {
  const mapUrl = apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE'
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}`
    : null

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#home" className="brand">
            <span className="brand-logo">PY</span>
            <span className="brand-name">Pearl's Yarniverse</span>
          </a>
          <p>Handmade with love and yarn. <br/>© {new Date().getFullYear()}</p>
          <div className="footer-socials">
            <a href={socials.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a href={socials.tiktok} target="_blank" rel="noreferrer">TikTok</a>
            <a href={socials.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>

        <div className="footer-map">
          <h3>Find Us In Polokwane</h3>
          {mapUrl ? (
            <iframe
              title="Business Location Map"
              src={mapUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="map-placeholder">
              <p><strong>Map Is Almost Ready!</strong></p>
              <p>To show the map, please add your Google Maps <code>Embed API key</code> in the <code>App.jsx</code> file.</p>
              <small>You can get a key from the Google Cloud Console.</small>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

/* ------------------------- Floating Socials ------------------------- */

function FloatingSocials({ socials }) {
  const items = [
    {
      name: 'Instagram',
      href: socials.instagram,
      svg: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor"
            d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.4.5.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.2.5.4 1.2.5 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.9-.5 2.4-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.5.2-1.2.4-2.4.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.4-.5-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.5-.4-1.2-.5-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.9.5-2.4.2-.6.5-1 1-1.5.5-.5.9.8 1.5-1 .5-.2 1.2.4 2.4-.5C8.4 2.2 8.8 2.2 12 2.2m0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-1.9.4-.5.2-.8.4-1.2.8-.4.4-.6.7-.8 1.2-.2.3-.3.9-.4 1.9-.1 1.1-.1 1.5-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.4 1.9.2.5.4.8.8 1.2.4.4.7.6 1.2.8.3.2.9.3 1.9.4 1.1.1 1.5.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 1.9-.4.5-.2.8-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.3.3-.9.4-1.9.1-1.1.1-1.5.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.4-1.9-.2-.5-.4-.8-.8-1.2-.4-.4-.7-.6-1.2-.8-.3-.2-.9-.3-1.9-.4-1.1-.1-1.5-.1-4.7-.1zM12 6.9a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2m0 1.8a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6zM17.5 6.6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      href: socials.tiktok,
      svg: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor"
            d="M21 8.5a7 7 0 0 1-4.9-2v8.2a5.7 5.7 0 1 1-5.7-5.7c.4 0 .7 0 1 .1V6.1c-.3 0-.7-.1-1-.1A8.3 8.3 0 1 0 19.7 14V7.9A9.3 9.3 0 0 0 21 8.5z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: socials.whatsapp,
      svg: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor"
            d="M20 3.9A10 10 0 0 0 4 19.9l-1.2 4.2 4.3-1.1A10 10 0 1 0 20 3.9zM12 20.4c-1.7 0-3.4-.5-4.9-1.5l-.4-.2-2.6.7.7-2.5-.3-.4A8.2 8.2 0 1 1 12 20.4zm4.6-5.8c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-1 .1-.2-.1-.9-.3-1.7-1.1-.6-.6-1.1-1.3-1.2-1.5-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3.1-.4 0-.1 0-.3-.1-.4-.1-.1-.7-1.8-1-2.4-.3-.6-.5-.5-.7-.5l-.6-.1c-.2 0-.4.1-.5.3-.2.2-.6.6-.6 1.5s.6 1.8.6 1.9c.1.2 1.2 2.3 2.9 3.3 1.7 1.1 1.7.7 2 .7.3 0 1-.4 1.1-.7.2-.3.2-.6.1-.7-.1-.1-.3-.1-.6-.3z" />
        </svg>
      ),
    },
  ]
  return (
    <div className="floating-socials">
      {items.map((it) => (
        <a key={it.name} href={it.href} target="_blank" rel="noreferrer" aria-label={it.name}>
          {it.svg}
          <span className="badge">{it.name}</span>
        </a>
      ))}
    </div>
  )
}

/* ----------------------------- Lightbox ---------------------------- */

function Lightbox({ open, image, onClose, onPrev, onNext }) {
  const overlayRef = useRef(null)
  if (!open) return null
  return (
    <div
      className="lightbox"
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <button className="lightbox-btn prev" onClick={onPrev} aria-label="Previous">‹</button>
      <figure className="lightbox-figure">
        <img src={image.src} alt={image.alt} />
        <figcaption>{image.alt}</figcaption>
      </figure>
      <button className="lightbox-btn next" onClick={onNext} aria-label="Next">›</button>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">✕</button>
    </div>
  )
}
