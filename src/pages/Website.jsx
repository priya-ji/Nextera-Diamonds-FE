import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Gem, Globe2, ShieldCheck, Truck, Mail, Phone, MapPin, Sparkles, Instagram, Linkedin } from 'lucide-react'
import Navbar from '../components/site/Navbar'
import DiamondArt from '../components/site/DiamondArt'
import ProductModal from '../components/site/ProductModal'
import EnquiryForm from '../components/site/EnquiryForm'
import { SITE_PRODUCTS, WHY_CHOOSE_US } from '../lib/siteData'
import heroDiamond from '../assets/hero-diamond.png'
import aboutDiamond from '../assets/about-diamond.png'
import roundBrilliantImage from '../assets/product-round-brilliant.png'
import cushionImage from '../assets/product-cushion.png'
import ovalImage from '../assets/product-oval.png'
import princessImage from '../assets/product-princess.png'
import emeraldImage from '../assets/product-emerald.png'
import pearImage from '../assets/product-pear.png'

const WHY_ICONS = [ShieldCheck, Globe2, Gem, Truck]
const PRODUCT_IMAGES = [roundBrilliantImage, cushionImage, ovalImage, princessImage, emeraldImage, pearImage]

export default function Website({ page = 'home' }) {
  const [selected, setSelected] = useState(null)
  const pageRef = useRef(null)
  const showHero = page === 'home'
  const showAbout = page === 'about'
  const showCollection = page === 'collection'
  const showWhy = page === 'why'
  const showContact = page === 'contact'

  useEffect(() => {
    const elements = [...(pageRef.current?.querySelectorAll('.scroll-reveal') ?? [])]

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' })

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [page])

  return (
    <div id="top" ref={pageRef} className="bg-porcelain">
      <Navbar />

      {/* ---------------- Hero ---------------- */}
      {showHero && <>
      <section className="facet-glow hero-grid relative min-h-[720px] overflow-hidden pt-24">
        <img src={heroDiamond} alt="Brilliant-cut diamond" className="hero-image absolute inset-0 h-full w-full object-cover object-[58%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,8,13,.96)_0%,rgba(4,8,13,.88)_35%,rgba(4,8,13,.32)_68%,rgba(4,8,13,.1)_100%)]" />
        <div className="hero-light-sweep" />
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-grain" />
        <div className="mx-auto grid min-h-[624px] max-w-6xl items-center gap-12 px-6 py-14 md:grid-cols-2 md:py-16">
          <div className="relative z-10 max-w-xl">
            <p className="animate-reveal mb-5 text-xs uppercase tracking-[0.25em] text-champagne-light">
              Certified diamonds · Since 1994
            </p>
            <h1 className="animate-reveal animate-delay-1 font-display text-5xl leading-[1.02] text-porcelain lg:text-6xl">
              The world&apos;s finest diamonds, sourced for the trade.
            </h1>
            <p className="animate-reveal animate-delay-2 mt-5 max-w-lg text-lg leading-relaxed text-porcelain/70">
              Lumière supplies certified loose diamonds and finished jewellery to
              wholesalers, retailers and independent jewellers across the globe.
            </p>
            <div className="animate-reveal animate-delay-3 mt-9 flex flex-wrap gap-4">
              <Link to="/collection" className="btn-primary">
                View the collection <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-outline border-white/25 bg-transparent text-porcelain hover:bg-white/10">
                Request trade pricing
              </Link>
            </div>
            <dl className="animate-reveal animate-delay-4 mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {[
                ['40+', 'Countries served'],
                ['12k', 'Certified stones in stock'],
                ['30 yrs', 'In the diamond trade'],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl text-champagne-light">{n}</dt>
                  <dd className="mt-1 text-xs text-porcelain/60">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative z-10 hidden md:block" aria-hidden="true" />
        </div>
      </section>

      <section className="overflow-hidden border-y border-slate-200 bg-white py-5">
        <div className="scroll-reveal marquee-track whitespace-nowrap text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          {[...Array(2)].flatMap(() => ['Ethically sourced', 'GIA & IGI certified', 'Insured global delivery', 'Trade-only pricing']).map((item, index) => (
            <span key={`${item}-${index}`} className="mx-8 inline-flex items-center gap-8">
              {item} <Sparkles size={13} className="text-champagne" />
            </span>
          ))}
        </div>
      </section>

      <section className="bg-porcelain py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[.9fr_1.1fr] md:items-center">
          <div className="scroll-reveal relative mx-auto w-full max-w-md md:mx-0">
            <div className="absolute -inset-5 rounded-3xl bg-champagne/10 blur-2xl" />
            <div className="about-image relative overflow-hidden rounded-2xl border border-slate-200 bg-midnight p-3 shadow-soft">
              <img src={aboutDiamond} alt="Certified diamond held by precision tweezers" className="aspect-[5/4] w-full rounded-xl object-cover object-[center_42%]" />
              <div className="absolute bottom-7 left-7 rounded-lg border border-white/10 bg-midnight/80 px-4 py-3 backdrop-blur">
                <p className="text-[10px] uppercase tracking-[0.18em] text-champagne-light">Since 1994</p>
                <p className="mt-1 text-sm text-porcelain">Trusted by the trade</p>
              </div>
            </div>
          </div>
          <div className="scroll-reveal max-w-xl" style={{ transitionDelay: '120ms' }}>
            <p className="text-xs uppercase tracking-[0.22em] text-champagne-dark">About Lumière Diamonds</p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-midnight">Built on trust.<br />Driven by excellence.</h2>
            <p className="mt-6 leading-relaxed text-slate-600">
              Lumière connects jewellery businesses with exceptional certified diamonds and fine pieces. We combine deep sourcing expertise with considered service, so every purchase feels assured from the first conversation to final delivery.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
              {[
                ['Ethical sourcing', ShieldCheck],
                ['Expert team', Globe2],
                ['Modern technology', Sparkles],
                ['Uncompromised quality', Gem],
              ].map(([label, Icon]) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={21} className="shrink-0 text-champagne-dark" />
                  <p className="text-xs font-semibold uppercase leading-relaxed tracking-[0.08em] text-slate-600">{label}</p>
                </div>
              ))}
            </div>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-midnight transition hover:text-champagne-dark">
              Discover our story <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-midnight py-24 text-porcelain">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(201,168,119,0.13),transparent_24%)]" />
        <div className="mx-auto max-w-6xl px-6">
          <div className="scroll-reveal flex flex-wrap items-end justify-between gap-6 text-center sm:text-left">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-champagne-light">Our products</p>
              <h2 className="mt-3 font-display text-4xl">Exquisite diamonds for every creation.</h2>
              <p className="mt-3 max-w-xl text-sm text-porcelain/60">Explore a refined selection of loose diamonds and finished jewellery, chosen for exceptional beauty and reliability.</p>
            </div>
            <Link to="/collection" className="inline-flex items-center gap-2 text-sm font-semibold text-champagne-light hover:text-porcelain">
              Explore all pieces <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SITE_PRODUCTS.map((product, index) => (
              <Link key={product.id} to="/collection" className="scroll-reveal home-card group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-champagne/50" style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="overflow-hidden bg-midnight">
                  <img src={PRODUCT_IMAGES[index]} alt={product.name} className="aspect-[5/4] w-full object-cover object-center transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-champagne-light">{product.category}</p>
                <h3 className="mt-2 font-display text-2xl">{product.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-porcelain/60">{product.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-champagne-light transition group-hover:text-porcelain">
                  View details <ArrowRight size={14} />
                </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="scroll-reveal">
            <p className="text-center text-xs uppercase tracking-[0.22em] text-champagne-dark">Why choose Lumière</p>
            <h2 className="mt-4 text-center font-display text-4xl leading-tight text-midnight">Your success is our commitment.</h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((item, index) => {
              const Icon = WHY_ICONS[index]
              return <div key={item.title} className="why-card scroll-reveal border-slate-200 text-center transition duration-300 hover:-translate-y-1 lg:border-r lg:px-6 last:border-0" style={{ transitionDelay: `${(index + 1) * 100}ms` }}>
                <Icon size={26} className="mx-auto text-champagne-dark" />
                <h3 className="mt-5 font-display text-xl text-midnight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.body}</p>
              </div>
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden bg-midnight py-24 text-porcelain">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_75%,rgba(201,168,119,0.14),transparent_23%)]" />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[.9fr_1.1fr] md:items-start">
          <div className="scroll-reveal relative">
            <p className="text-xs uppercase tracking-[0.22em] text-champagne-light">Get in touch</p>
            <h2 className="mt-3 font-display text-4xl leading-tight">Let&apos;s build brilliance together.</h2>
            <p className="mt-5 max-w-md leading-relaxed text-porcelain/60">
              Send a quick brief and our trade desk will respond with availability, certification and tailored wholesale pricing.
            </p>
            <ul className="mt-9 space-y-4 text-sm text-porcelain/70">
              <li className="flex items-center gap-3"><Mail size={18} className="text-champagne-light" /> trade@lumierediamonds.com</li>
              <li className="flex items-center gap-3"><Phone size={18} className="text-champagne-light" /> +91 84315 50963</li>
              <li className="flex items-center gap-3"><MapPin size={18} className="text-champagne-light" /> Bengaluru · Antwerp · Dubai</li>
            </ul>
          </div>
          <div className="scroll-reveal" style={{ transitionDelay: '120ms' }}>
            <EnquiryForm dark />
          </div>
        </div>
      </section>
      </>}

      {/* ---------------- About ---------------- */}
      {showAbout && <section className="mx-auto max-w-6xl px-6 pb-24 pt-36">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:items-center">
          <h2 className="font-display text-4xl leading-tight text-midnight">
            A house built on certainty.
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-slate-600">
            <p>
              For three decades Lumière has been a quiet fixture of the international
              diamond trade — the supplier other jewellers rely on when the grading has
              to be right and the delivery has to arrive.
            </p>
            <p>
              We work directly with cutting houses and certified suppliers, which keeps
              our pricing honest and our provenance clean. Every stone we sell is
              accompanied by an independent grading report, and every shipment is fully
              insured from our vault to your counter.
            </p>
          </div>
        </div>
      </section>}

      {/* ---------------- Products ---------------- */}
      {showCollection && <section className="bg-white pb-24 pt-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-champagne-dark">The collection</p>
              <h2 className="mt-2 font-display text-4xl text-midnight">Signature pieces</h2>
            </div>
            <p className="max-w-sm text-slate-500">
              A selection from our current inventory. Trade partners see full pricing and
              certification on login.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SITE_PRODUCTS.map((p) => (
              <article key={p.id} className="group">
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <DiamondArt
                    tone={p.tone}
                    className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-champagne-dark">
                    {p.category}
                  </p>
                  <h3 className="mt-1 font-display text-xl text-midnight">{p.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                    {p.description}
                  </p>
                  <button
                    onClick={() => setSelected(p)}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-midnight underline-offset-4 hover:underline focus-ring"
                  >
                    View details <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>}

      {/* ---------------- Why choose us ---------------- */}
      {showWhy && <section className="bg-midnight pb-24 pt-36 text-porcelain">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-4xl">Why the trade chooses Lumière</h2>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((item, i) => {
              const Icon = WHY_ICONS[i]
              return (
                <div key={item.title}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-champagne/15 text-champagne-light">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 font-display text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-porcelain/60">{item.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>}

      {/* ---------------- Contact ---------------- */}
      {showContact && <section className="pb-24 pt-36">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-champagne-dark">Get in touch</p>
            <h2 className="mt-2 font-display text-4xl text-midnight">
              Open a trade account
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-slate-600">
              Tell us what you&apos;re looking for and our trade desk will respond with
              availability, certification and wholesale pricing.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-slate-700">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-champagne-dark" /> trade@lumierediamonds.com
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-champagne-dark" /> +91 84315 50963
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-champagne-dark" /> Bengaluru · Antwerp · Dubai
              </li>
            </ul>
          </div>
          <EnquiryForm />
        </div>
      </section>}

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-white/10 bg-midnight text-porcelain">
        {showHero && <div className="border-b border-white/10 bg-[linear-gradient(120deg,#8f6f3f,#b08d57,#d2b47d)]">
          <div className="scroll-reveal mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">For the international trade</p>
              <h2 className="mt-2 font-display text-3xl text-white">Let&apos;s source your next exceptional stone.</h2>
            </div>
            <Link to="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-md bg-midnight px-5 py-3 text-sm font-semibold text-porcelain transition hover:bg-midnight-700">
              Speak with the trade desk <ArrowRight size={16} />
            </Link>
          </div>
        </div>}

        <div className="scroll-reveal mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-[1.45fr_.8fr_1fr_.8fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl">Lumière</span>
              <span className="text-xs uppercase tracking-[0.2em] text-champagne-light">Diamonds</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-porcelain/60">
              Certified diamonds and fine jewellery for the international trade.
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-champagne-light">Bengaluru · Antwerp · Dubai</p>
            <div className="mt-6 flex items-center gap-3">
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-porcelain/60 transition hover:text-champagne-light"><Instagram size={18} /></a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-porcelain/60 transition hover:text-champagne-light"><Linkedin size={18} /></a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-champagne-light">Navigate</h4>
            <ul className="mt-4 space-y-2 text-sm text-porcelain/60">
              <li><Link to="/" className="transition hover:text-porcelain">Home</Link></li>
              <li><Link to="/collection" className="hover:text-porcelain">Collection</Link></li>
              <li><Link to="/about" className="hover:text-porcelain">About</Link></li>
              <li><Link to="/why-us" className="hover:text-porcelain">Why us</Link></li>
              <li><Link to="/contact" className="hover:text-porcelain">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-champagne-light">Contact</h4>
            <ul className="mt-4 space-y-2 text-sm text-porcelain/60">
              <li><a href="mailto:trade@lumierediamonds.com" className="transition hover:text-porcelain">trade@lumierediamonds.com</a></li>
              <li><a href="tel:+918431550963" className="transition hover:text-porcelain">+91 84315 50963</a></li>
              <li className="pt-1 leading-relaxed">Bengaluru, India<br />By appointment only</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-champagne-light">Trade access</h4>
            <p className="mt-4 text-sm leading-relaxed text-porcelain/60">Existing partners can check inventory, transactions and live stock levels.</p>
            <Link to="/login" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-porcelain transition hover:text-champagne-light">
              Trade login <ArrowRight size={15} />
            </Link>
          </div>
        </div>
          <div className="scroll-reveal border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-porcelain/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Lumière Diamonds. All rights reserved.</p>
            <p>Certified provenance · Insured delivery · Trade only</p>
          </div>
        </div>
      </footer>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
