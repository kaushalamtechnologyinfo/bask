import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

// Preserve exact existing voucher denominations & official Stripe Checkout URLs
const VOUCHER_TIERS = [
  {
    id: '50',
    amount: '$50',
    numericAmount: 50,
    italianEdition: 'EDIZIONE I · L’APERITIVO',
    title: 'A Taste of Baskk',
    subtitle: 'Cocktails & Antipasti by the Sea',
    desc: 'An intimate invitation for afternoon spritzes, signature beachfront cocktails, and handcrafted Italian antipasti overlooking Coolangatta.',
    badge: 'Aperitivo Gift',
    stripeUrl: 'https://buy.stripe.com/fZu8wPenPaXD8x4dzB9R604',
    defaultDesignId: 'terracotta',
    image: '/baskk-new/cocktail-spritz-refreshing.jpg',
    cardBg: '#B9674B',
    cardText: '#F5F0E8',
    cardAccent: '#E5DCCE',
    features: ['Instant Digital Delivery', 'Valid on All Food & Cocktails', '3-Year Validity']
  },
  {
    id: '100',
    amount: '$100',
    numericAmount: 100,
    italianEdition: 'EDIZIONE II · LA TAVOLA',
    title: 'Coastal Italian Dining',
    subtitle: 'Pasta, Pizza & Wine for Two',
    desc: 'Our signature dining gift for couples and close friends — house-made pasta, artisanal pizzas from house-made dough, and curated Italian wines.',
    badge: 'Most Popular',
    isFeatured: true,
    stripeUrl: 'https://buy.stripe.com/7sY00jcfH0iZ7t05359R605',
    defaultDesignId: 'charcoal',
    image: '/baskk-new/handcrafted-pasta-ragu.jpg',
    cardBg: '#191919',
    cardText: '#F5F0E8',
    cardAccent: '#B9674B',
    features: ['Instant Digital Delivery', 'Complete Dinner for Two', 'Oceanfront Dining Experience', '3-Year Validity']
  },
  {
    id: '200',
    amount: '$200',
    numericAmount: 200,
    italianEdition: 'EDIZIONE III · IL BANCHETTO',
    title: 'The Ultimate Feast',
    subtitle: 'Deluxe Celebration Banquet',
    desc: 'An unforgettable multi-course shared feast featuring local coastal seafood, signature mains, bespoke cocktails, and house-made dolci.',
    badge: 'Collector’s Reserve',
    stripeUrl: 'https://buy.stripe.com/00w8wP7Zr0iZdRoanp9R606',
    defaultDesignId: 'ivory',
    image: '/baskk-new/menu-feast-overhead.jpg',
    cardBg: '#F5F0E8',
    cardText: '#191919',
    cardAccent: '#B9674B',
    features: ['Instant Digital Delivery', 'Multi-Course Shared Banquet', 'Premium Wine & Cocktails', '3-Year Validity']
  }
];

const CARD_DESIGNS = [
  {
    id: 'charcoal',
    name: 'Notte Italiana',
    subtitle: 'Obsidian & Terracotta Gold',
    bg: 'linear-gradient(135deg, #191919 0%, #252220 55%, #141414 100%)',
    textColor: '#F5F0E8',
    mutedColor: '#C5B9A8',
    accentColor: '#B9674B',
    borderColor: 'rgba(185, 103, 75, 0.45)',
    innerBorder: 'rgba(245, 240, 232, 0.14)',
    swatch: '#191919'
  },
  {
    id: 'terracotta',
    name: 'Terracotta Sol',
    subtitle: 'Warm Tuscan Clay & Ivory',
    bg: 'linear-gradient(135deg, #B9674B 0%, #9E5238 60%, #844029 100%)',
    textColor: '#FFFFFF',
    mutedColor: '#F5F0E8',
    accentColor: '#F5F0E8',
    borderColor: 'rgba(245, 240, 232, 0.45)',
    innerBorder: 'rgba(255, 255, 255, 0.22)',
    swatch: '#B9674B'
  },
  {
    id: 'ivory',
    name: 'Carta d’Avorio',
    subtitle: 'Archival Ivory & Espresso',
    bg: 'linear-gradient(135deg, #F5F0E8 0%, #EDE4D5 60%, #E5DCCE 100%)',
    textColor: '#191919',
    mutedColor: '#5C5349',
    accentColor: '#B9674B',
    borderColor: 'rgba(25, 25, 25, 0.2)',
    innerBorder: 'rgba(185, 103, 75, 0.35)',
    swatch: '#E5DCCE'
  },
  {
    id: 'espresso',
    name: 'Riserva Barolo',
    subtitle: 'Deep Espresso & Warm Bronze',
    bg: 'linear-gradient(135deg, #2B1E1A 0%, #3A2620 55%, #1E1412 100%)',
    textColor: '#F5F0E8',
    mutedColor: '#D8C8B8',
    accentColor: '#D48C6F',
    borderColor: 'rgba(212, 140, 111, 0.4)',
    innerBorder: 'rgba(245, 240, 232, 0.15)',
    swatch: '#3A2620'
  }
];

const GIFT_OCCASIONS = [
  {
    id: 'Birthday',
    label: 'Birthday',
    tagline: 'Toast another year by the sea',
    desc: 'Celebrate with handcrafted pasta, wood-fired style pizzas, and sunset cocktails on Marine Parade.',
    defaultQuote: 'Wishing you the happiest of birthdays filled with long Italian lunches, great wine, and unforgettable coastal moments at Baskk.',
    image: '/life-at-bask/DSC08973.jpg'
  },
  {
    id: 'Anniversary',
    label: 'Anniversary',
    tagline: 'An intimate table for two',
    desc: 'Candlelit coastal ambiance, regional Italian wines, and dishes designed to be shared slowly together.',
    defaultQuote: 'Here’s to celebrating your love story over an unforgettable evening of modern Italian dining and cocktails by the beach.',
    image: '/baskk-new/reservation-dining-table.jpg'
  },
  {
    id: 'Celebration',
    label: 'Celebration',
    tagline: 'Milestones worth raising a glass to',
    desc: 'From engagements and promotions to graduations and new beginnings, mark the moment in style.',
    defaultQuote: 'Congratulations on this special milestone! Raise a glass and enjoy a well-deserved feast at Baskk Italian.',
    image: '/life-at-bask/DSC09009.jpg'
  },
  {
    id: 'Thank You',
    label: 'Thank You',
    tagline: 'Gratitude, thoughtfully expressed',
    desc: 'A refined gesture of appreciation for clients, colleagues, hosts, or dear friends.',
    defaultQuote: 'Thank you for everything. Treat yourself to a relaxing evening of delicious Italian food and drinks at Baskk.',
    image: '/baskk-new/fresh-gnocchi-truffle.jpg'
  },
  {
    id: 'Just Because',
    label: 'Just Because',
    tagline: 'Spontaneous moments of joy',
    desc: 'Sometimes the best gifts need no calendar date — simply an invitation to slow down and dine well.',
    defaultQuote: 'Thinking of you! Enjoy a beautiful afternoon or evening of Italian flavours and ocean breezes at Baskk.',
    image: '/baskk-new/pizza-burrata-special.jpg'
  }
];

const FAQ_ITEMS = [
  {
    q: 'How do I purchase a Baskk Italian gift voucher online?',
    a: 'Simply select your preferred voucher value ($50, $100, or $200 AUD), choose a card design, personalize it with the recipient’s name and your message, and click "Proceed to Secure Payment". Your voucher details are immediately registered with our team and you are directed to Stripe Checkout to complete payment.'
  },
  {
    q: 'How do I redeem a gift voucher at the restaurant?',
    a: 'Present your digital gift voucher (either on your smartphone or as a printed copy) showing your unique BASKK-GV reference code to your server when dining at Baskk Italian, 52–58 Marine Parade, Coolangatta.'
  },
  {
    q: 'How does Baskk know when I purchase a voucher online?',
    a: 'The moment you submit your customized voucher and complete checkout, an automated order notification containing your unique voucher code, buyer details, recipient name, and gift value is sent directly to our management team at request@baskk.co.'
  },
  {
    q: 'How long are gift vouchers valid for?',
    a: 'In full accordance with Australian Consumer Law, all Baskk Italian gift vouchers are valid for 3 years (36 months) from the date of purchase.'
  },
  {
    q: 'What can the gift voucher be spent on?',
    a: 'Gift vouchers are redeemable across our entire dine-in food and beverage menus, including antipasti, house-made pasta, wood-fired style pizzas, signature cocktails, wines, and desserts.'
  },
  {
    q: 'Can I choose a future delivery date or send the voucher to myself?',
    a: 'Yes. In the interactive customizer, you can choose to send the voucher to a recipient or to your own email address (perfect if you wish to print it and place it inside a greeting card), and you may select either instant delivery or a scheduled date.'
  }
];

const VOUCHER_TERMS = [
  {
    title: 'Voucher Validity',
    text: 'Gift Vouchers are valid exclusively at Baskk Italian, Coolangatta, Gold Coast, Queensland.'
  },
  {
    title: 'Online Purchase',
    text: 'Gift Vouchers can be purchased online through the official Baskk Italian website.'
  },
  {
    title: 'Electronic Delivery',
    text: 'Gift Vouchers are issued electronically and sent to the email address nominated at the time of purchase.'
  },
  {
    title: 'Lost or Stolen Vouchers',
    text: 'Please treat your Gift Voucher like cash. If a voucher is lost or stolen, contact Baskk Italian. Replacement may be arranged where the original purchase and remaining balance can be verified. Vouchers already fully redeemed cannot be replaced.'
  },
  {
    title: 'Voucher Ownership',
    text: 'Gift Vouchers are issued by Baskk Italian and may be transferred or gifted to another person.'
  },
  {
    title: 'Voucher Redemption',
    text: 'Gift Vouchers must be presented electronically via email, digital voucher or valid voucher code at the time of payment.'
  },
  {
    title: 'Cash Redemption',
    text: 'Gift Vouchers cannot be exchanged for cash or refunded for change of mind, except where required by Australian Consumer Law.'
  },
  {
    title: 'Partial Redemption',
    text: 'Gift Vouchers may be partially redeemed. Any unused balance will remain available for future purchases until the voucher expires. No cash change will be provided.'
  },
  {
    title: 'Additional Payment',
    text: 'If the total bill exceeds the remaining Gift Voucher balance, the customer must pay the difference using another accepted payment method.'
  },
  {
    title: 'Expiry Date',
    text: 'Gift Vouchers are valid for 36 months (3 years) from the date of purchase or supply, whichever is later. The expiry date will be clearly displayed on each voucher.'
  },
  {
    title: 'No Hidden Fees',
    text: 'No activation, administration, inactivity or balance enquiry fees will be charged after the Gift Voucher has been issued.'
  },
  {
    title: 'Non-Reloadable',
    text: 'Gift Vouchers cannot be reloaded or topped up after purchase.'
  },
  {
    title: 'Amendments',
    text: 'Baskk Italian reserves the right to update these Terms & Conditions. Any changes will not reduce the value, validity period or existing rights of previously purchased Gift Vouchers.'
  },
  {
    title: 'Australian Consumer Law',
    text: 'Nothing in these Terms & Conditions excludes, restricts or modifies any consumer rights or guarantees provided under Australian Consumer Law.'
  }
];

export default function GiftsPage({ onOpenBook }) {
  const [searchParams] = useSearchParams();
  const pageRef = useRef(null);
  const previewCardRef = useRef(null);

  const initialAmountParam = searchParams.get('amount') || '100';
  const [selectedTier, setSelectedTier] = useState(
    VOUCHER_TIERS.find(t => t.id === initialAmountParam) || VOUCHER_TIERS[1]
  );
  const [selectedDesign, setSelectedDesign] = useState(CARD_DESIGNS[0]);
  const [activeOccasion, setActiveOccasion] = useState(GIFT_OCCASIONS[0]);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const [voucherCode, setVoucherCode] = useState('');
  const [deliveryType, setDeliveryType] = useState('Send to Recipient');
  const [deliverySchedule, setDeliverySchedule] = useState('Instant Delivery');
  const [scheduledDate, setScheduledDate] = useState('');

  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    recipientName: '',
    recipientEmail: '',
    personalMessage: 'Wishing you an unforgettable evening of delicious Italian flavours, fine wine, and coastal hospitality at Baskk.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Generate unique voucher reference code
  useEffect(() => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    setVoucherCode(`BASKK-GV-${randomDigits}`);
  }, []);

  // Sync URL query parameter
  useEffect(() => {
    const amt = searchParams.get('amount');
    if (amt) {
      const found = VOUCHER_TIERS.find(t => t.id === amt.replace('$', ''));
      if (found) {
        setSelectedTier(found);
        const matchingDesign = CARD_DESIGNS.find(d => d.id === found.defaultDesignId);
        if (matchingDesign) setSelectedDesign(matchingDesign);
      }
    }
  }, [searchParams]);

  // GSAP Editorial & ScrollTrigger Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        '.gifts-hero-eyebrow, .gifts-hero-heading, .gifts-hero-lead, .gifts-hero-actions, .gifts-hero-meta',
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }
      ).fromTo(
        '.gifts-hero-visual-wrap',
        { y: 40, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 1.1 },
        '-=0.65'
      );

      // Section headers scroll reveal
      gsap.utils.toArray('.editorial-reveal-up').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              toggleActions: 'play none none none'
            }
          }
        );
      });

      // Collection cards stagger
      gsap.fromTo(
        '.collection-bespoke-card',
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.collection-cards-grid',
            start: 'top 82%'
          }
        }
      );

      // Clip-path image reveal in Experience section
      gsap.utils.toArray('.clip-reveal-img-wrap').forEach((wrap) => {
        gsap.fromTo(
          wrap,
          { clipPath: 'inset(12% 8% 12% 8% round 16px)', opacity: 0.4 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 16px)',
            opacity: 1,
            duration: 1.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: wrap,
              start: 'top 84%'
            }
          }
        );
      });

      // Subtle parallax on editorial imagery
      gsap.utils.toArray('.parallax-dining-img').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Animate Live Gift Card Preview when design, tier, or occasion changes
  useEffect(() => {
    if (!previewCardRef.current) return;
    gsap.fromTo(
      previewCardRef.current,
      { scale: 0.975, opacity: 0.82, rotateY: -4 },
      { scale: 1, opacity: 1, rotateY: 0, duration: 0.45, ease: 'power2.out' }
    );
  }, [selectedTier, selectedDesign, activeOccasion]);

  const issueDate = new Date().toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const expiryDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 3);
    return d.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  })();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError('');
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectCollectionCard = (tier) => {
    setSelectedTier(tier);
    const matchingDesign = CARD_DESIGNS.find(d => d.id === tier.defaultDesignId);
    if (matchingDesign) setSelectedDesign(matchingDesign);
    scrollToSection('gift-customizer');
  };

  const handleSelectOccasion = (occ, shouldScroll = false) => {
    setActiveOccasion(occ);
    setFormData(prev => ({
      ...prev,
      personalMessage: occ.defaultQuote
    }));
    if (shouldScroll) {
      scrollToSection('gift-customizer');
    }
  };

  // Preserve exact checkout & notification flow to request@baskk.co + Stripe Checkout
  const handleSubmitVoucherOrder = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.buyerName.trim() || !formData.buyerEmail.trim() || !formData.buyerPhone.trim()) {
      setSubmitError('Please enter your name, email address, and phone number to continue.');
      return;
    }

    if (deliveryType === 'Send to Recipient' && (!formData.recipientName.trim() || !formData.recipientEmail.trim())) {
      setSubmitError('Please enter the recipient’s name and email address.');
      return;
    }

    setIsSubmitting(true);

    const finalRecipientName = deliveryType === 'Send to Myself'
      ? (formData.buyerName || 'Valued Guest')
      : (formData.recipientName || formData.buyerName || 'Valued Guest');

    const finalRecipientEmail = deliveryType === 'Send to Myself'
      ? formData.buyerEmail
      : (formData.recipientEmail || formData.buyerEmail);

    const finalDeliveryDate = deliverySchedule === 'Scheduled Date' && scheduledDate
      ? `Scheduled for ${scheduledDate}`
      : 'Instant Digital Delivery';

    const savedSheetUrl =
      (typeof window !== 'undefined' && localStorage.getItem('baskk_google_sheet_webapp_url')) ||
      import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL ||
      '';

    const voucherPayload = {
      voucherCode,
      voucherAmount: `${selectedTier.amount} AUD`,
      originalAmount: selectedTier.numericAmount,
      remainingBalance: selectedTier.numericAmount,
      voucherTitle: `${selectedTier.title} (${selectedTier.subtitle}) — ${selectedDesign.name}`,
      buyerName: formData.buyerName,
      buyerEmail: formData.buyerEmail,
      buyerPhone: formData.buyerPhone,
      recipientName: finalRecipientName,
      recipientEmail: finalRecipientEmail,
      deliveryType,
      deliveryDate: finalDeliveryDate,
      occasion: activeOccasion.label,
      personalMessage: formData.personalMessage || 'Wishing you an unforgettable coastal Italian dining experience at Baskk!',
      purchaseDate: issueDate,
      expiryDate,
      stripeUrl: selectedTier.stripeUrl,
      sheetsWebhookUrl: savedSheetUrl
    };

    // Also record in local browser ledger so testing on the same device immediately shows in /gifts-admin
    try {
      const existingRaw = localStorage.getItem('baskk_voucher_ledger_v1');
      const existingList = existingRaw ? JSON.parse(existingRaw) : [];
      const localEntry = {
        voucherCode,
        purchaseDate: issueDate,
        expiryDate,
        originalAmount: selectedTier.numericAmount,
        remainingBalance: selectedTier.numericAmount,
        status: 'Active',
        paymentStatus: 'Verify Stripe Payment',
        buyerName: formData.buyerName,
        buyerEmail: formData.buyerEmail,
        buyerPhone: formData.buyerPhone,
        recipientName: finalRecipientName,
        recipientEmail: finalRecipientEmail,
        occasion: activeOccasion.label,
        deliveryDate: finalDeliveryDate,
        personalMessage: formData.personalMessage || '',
        notes: `Online order (${selectedDesign.name})`
      };
      localStorage.setItem('baskk_voucher_ledger_v1', JSON.stringify([localEntry, ...existingList]));
    } catch (e) {
      // ignore storage quota errors
    }

    const formSubmitPayload = {
      _subject: `New Gift Voucher Order (${selectedTier.amount} AUD) - ${formData.buyerName} [${voucherCode}]`,
      _template: 'table',
      "Voucher Code": voucherCode,
      "Voucher Amount": `${selectedTier.amount} AUD`,
      "Voucher Package": `${selectedTier.title} - ${selectedTier.subtitle}`,
      "Card Design": selectedDesign.name,
      "Purchaser Name": formData.buyerName,
      "Purchaser Email": formData.buyerEmail,
      "Purchaser Phone": formData.buyerPhone,
      "Recipient Name": finalRecipientName,
      "Recipient Email": finalRecipientEmail,
      "Delivery Type": deliveryType,
      "Delivery Schedule": finalDeliveryDate,
      "Occasion": activeOccasion.label,
      "Personal Gift Message": formData.personalMessage || 'None',
      "Valid Until (3 Years)": expiryDate,
      _captcha: 'false'
    };

    try {
      await fetch('/api/gift-voucher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(voucherPayload)
      });
    } catch (apiErr) {
      console.warn('Gift voucher API note:', apiErr);
    }

    try {
      await fetch('https://formsubmit.co/ajax/request@baskk.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formSubmitPayload)
      });
    } catch (err) {
      console.warn('FormSubmit gift voucher notification note:', err);
    }

    setIsSubmitting(false);
    setOrderCompleted(true);

    const stripeRedirectUrl = `${selectedTier.stripeUrl}?prefilled_email=${encodeURIComponent(formData.buyerEmail)}&client_reference_id=${encodeURIComponent(voucherCode)}`;
    window.open(stripeRedirectUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="baskk-gifts-editorial-page" ref={pageRef}>
      <Navbar onOpenBook={onOpenBook} />

      <main className="gifts-editorial-main">
        {/* =====================================================================
            SECTION 1 – EDITORIAL GIFT PAGE HERO
            "The Art of Giving." / "Give the Gift of a Beautiful Experience."
        ===================================================================== */}
        <section className="gifts-editorial-hero" aria-label="Baskk Italian Gift Cards Hero">
          <div className="gifts-container hero-split-grid">
            {/* Left Editorial Narrative */}
            <div className="hero-editorial-copy">
              <div className="gifts-hero-eyebrow">
                <span className="eyebrow-line"></span>
                <span>BASKK ITALIAN &bull; DIGITAL GIFT CARDS</span>
              </div>

              <h1 className="gifts-hero-heading">
                The Art of Giving.
                <span className="heading-italic-sub">Give the Gift of a Beautiful Experience.</span>
              </h1>

              <p className="gifts-hero-lead">
                Give someone a reason to celebrate, connect and create beautiful memories over Italian food. Share unforgettable moments, handcrafted pasta, wood-fired style pizzas, and beachfront cocktails in Coolangatta.
              </p>

              <div className="gifts-hero-actions">
                <button
                  type="button"
                  className="btn-editorial-primary"
                  onClick={() => scrollToSection('voucher-collection')}
                >
                  <span>Explore Gift Cards</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>

                <button
                  type="button"
                  className="btn-editorial-outline"
                  onClick={() => scrollToSection('gift-customizer')}
                >
                  <span>Personalize Your Card</span>
                </button>
              </div>

              <div className="gifts-hero-meta">
                <div className="meta-pillar">
                  <span className="meta-num">$50 – $200</span>
                  <span className="meta-lbl">Curated Editions</span>
                </div>
                <div className="meta-sep"></div>
                <div className="meta-pillar">
                  <span className="meta-num">Instant</span>
                  <span className="meta-lbl">Or Scheduled Email</span>
                </div>
                <div className="meta-sep"></div>
                <div className="meta-pillar">
                  <span className="meta-num">3 Years</span>
                  <span className="meta-lbl">Australian Validity</span>
                </div>
              </div>
            </div>

            {/* Right Visual Composition: Authentic Dining Photography + Floating Gift Card Mockup */}
            <div className="gifts-hero-visual-wrap">
              <div className="hero-photo-frame">
                <img
                  src="/baskk-new/reservation-dining-table.jpg"
                  alt="Baskk Italian dining table set with artisan dishes and cocktails"
                  className="hero-main-photo parallax-dining-img"
                />
                <div className="hero-photo-caption">
                  <span>52–58 MARINE PARADE, COOLANGATTA</span>
                </div>
              </div>

              {/* Artistic Floating Gift Voucher Mockup */}
              <div
                className="hero-floating-voucher-mockup"
                onClick={() => scrollToSection('gift-customizer')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && scrollToSection('gift-customizer')}
                aria-label="Customize Baskk Gift Voucher"
              >
                <div className="mockup-inner-border">
                  <div className="mockup-top-row">
                    <div className="mockup-brand-cluster">
                      <img src="/baskk_logo.png" alt="Baskk Italian" className="mockup-logo" />
                      <div>
                        <span className="mockup-brand-title">BASKK ITALIAN</span>
                        <span className="mockup-brand-sub">MODERN ITALIAN &amp; COCKTAILS</span>
                      </div>
                    </div>
                    <span className="mockup-edition-tag">GIFT VOUCHER</span>
                  </div>

                  <div className="mockup-center-art">
                    <div className="mockup-amount-display">
                      <span className="cur">AUD</span>
                      <span className="val">{selectedTier.amount}</span>
                    </div>
                    <p className="mockup-quote">“An invitation to gather, toast, and dine by the sea.”</p>
                  </div>

                  <div className="mockup-bottom-row">
                    <span>COOLANGATTA, GOLD COAST</span>
                    <span className="mockup-cta-link">Personalize &rarr;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 2 – GIFT VOUCHER COLLECTION
            Distinctive bespoke visual styles for $50, $100, and $200 AUD
        ===================================================================== */}
        <section className="gifts-collection-section" id="voucher-collection" aria-label="Gift Voucher Collection">
          <div className="gifts-container">
            <div className="section-editorial-header editorial-reveal-up">
              <span className="editorial-kicker">THE CURATED COLLECTION</span>
              <h2 className="editorial-h2">Select Your Gift Edition</h2>
              <p className="editorial-sub">
                Each Baskk gift card is thoughtfully composed for a distinct coastal dining occasion — from sunset aperitivo to a shared multi-course celebration banquet.
              </p>
            </div>

            <div className="collection-cards-grid">
              {VOUCHER_TIERS.map((tier, idx) => {
                const isSelected = selectedTier.id === tier.id;
                return (
                  <article
                    key={tier.id}
                    className={`collection-bespoke-card edition-style-${tier.id} ${isSelected ? 'is-selected' : ''}`}
                  >
                    {/* Top Bespoke Voucher Artwork Mockup */}
                    <div className="bespoke-voucher-artwork">
                      <img
                        src={tier.image}
                        alt={tier.title}
                        className="artwork-bg-photo"
                        loading="lazy"
                      />
                      <div className="artwork-overlay"></div>

                      {/* Miniature Luxury Voucher Plate inside Artwork */}
                      <div
                        className="artwork-voucher-plate"
                        style={{
                          backgroundColor: tier.cardBg,
                          color: tier.cardText,
                          borderColor: tier.cardAccent
                        }}
                      >
                        <div className="plate-frame">
                          <div className="plate-header">
                            <span className="plate-edition">{tier.italianEdition}</span>
                            <span className="plate-badge">{tier.badge}</span>
                          </div>

                          <div className="plate-center">
                            <div className="plate-price">
                              <span className="plate-cur">AUD</span>
                              <span className="plate-amt">{tier.amount}</span>
                            </div>
                            <span className="plate-brand-mark">BASKK ITALIAN</span>
                          </div>

                          <div className="plate-footer">
                            <span>COOLANGATTA</span>
                            <span>0{idx + 1} / 03</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Editorial Card Body */}
                    <div className="bespoke-card-content">
                      <div className="bespoke-title-row">
                        <div>
                          <span className="bespoke-subtitle">{tier.subtitle}</span>
                          <h3 className="bespoke-title">{tier.title}</h3>
                        </div>
                        <span className="bespoke-amount-tag">{tier.amount}</span>
                      </div>

                      <p className="bespoke-desc">{tier.desc}</p>

                      <ul className="bespoke-highlights">
                        {tier.features.map((feat, fIdx) => (
                          <li key={fIdx}>
                            <span className="bullet-diamond">◆</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="bespoke-card-actions">
                        <button
                          type="button"
                          className={`btn-select-gift ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSelectCollectionCard(tier)}
                        >
                          <span>{isSelected ? `Selected — Customize ${tier.amount} Gift` : `Select Gift — ${tier.amount}`}</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 3 – INTERACTIVE GIFT CARD CUSTOMIZER
            Two-column layout with instant live preview & smooth transitions
        ===================================================================== */}
        <section className="gifts-customizer-section" id="gift-customizer" aria-label="Interactive Gift Card Customizer">
          <div className="gifts-container">
            <div className="section-editorial-header editorial-reveal-up">
              <span className="editorial-kicker">BESPOKE PERSONALIZATION STUDIO</span>
              <h2 className="editorial-h2">Craft Your Digital Gift Card</h2>
              <p className="editorial-sub">
                Select your voucher value, choose an Italian card aesthetic, and compose a personal message. Your live preview updates automatically as you type.
              </p>
            </div>

            <div className="customizer-two-col-layout">
              {/* LEFT COLUMN: CUSTOMIZATION CONTROLS & CHECKOUT FORM */}
              <div className="customizer-controls-col">
                {orderCompleted ? (
                  <div className="customizer-confirmation-panel">
                    <div className="conf-crest-badge">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="conf-kicker">VOUCHER REGISTERED &bull; {voucherCode}</span>
                    <h3 className="conf-heading">Complete Your {selectedTier.amount} Payment</h3>
                    <p className="conf-text">
                      Your personalized gift card details and reference code (<strong>{voucherCode}</strong>) have been sent to our hospitality team at <strong>request@baskk.co</strong>. Please complete your secure payment in the Stripe Checkout window.
                    </p>

                    <div className="conf-ledger-box">
                      <div className="ledger-row">
                        <span>Gift Edition</span>
                        <strong>{selectedTier.amount} AUD — {selectedTier.title}</strong>
                      </div>
                      <div className="ledger-row">
                        <span>Card Aesthetic</span>
                        <strong>{selectedDesign.name}</strong>
                      </div>
                      <div className="ledger-row">
                        <span>Voucher Code</span>
                        <strong className="mono-code">{voucherCode}</strong>
                      </div>
                      <div className="ledger-row">
                        <span>Recipient</span>
                        <strong>{deliveryType === 'Send to Myself' ? formData.buyerName : (formData.recipientName || formData.buyerName)}</strong>
                      </div>
                      <div className="ledger-row">
                        <span>Sender</span>
                        <strong>{formData.buyerName} ({formData.buyerEmail})</strong>
                      </div>
                      <div className="ledger-row">
                        <span>Valid Until</span>
                        <strong>{expiryDate} (3 Years)</strong>
                      </div>
                    </div>

                    <div className="conf-button-stack">
                      <a
                        href={`${selectedTier.stripeUrl}?prefilled_email=${encodeURIComponent(formData.buyerEmail)}&client_reference_id=${encodeURIComponent(voucherCode)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-editorial-primary full-width"
                      >
                        <span>Open Secure Stripe Checkout ({selectedTier.amount} AUD)</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>

                      <button
                        type="button"
                        className="btn-editorial-outline full-width"
                        onClick={() => window.print()}
                      >
                        <span>Print or Save Digital Voucher PDF</span>
                      </button>

                      <button
                        type="button"
                        className="btn-text-reset"
                        onClick={() => {
                          setOrderCompleted(false);
                          const newDigits = Math.floor(100000 + Math.random() * 900000);
                          setVoucherCode(`BASKK-GV-${newDigits}`);
                        }}
                      >
                        &larr; Customize Another Gift Voucher
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="customizer-editorial-form" onSubmit={handleSubmitVoucherOrder} noValidate>
                    {/* Step 01: Select Voucher Amount */}
                    <div className="cust-field-group">
                      <div className="cust-group-header">
                        <span className="step-num">01</span>
                        <label className="cust-group-title">Select Voucher Amount</label>
                      </div>
                      <div className="cust-amount-grid">
                        {VOUCHER_TIERS.map((tier) => (
                          <button
                            key={tier.id}
                            type="button"
                            className={`cust-amount-btn ${selectedTier.id === tier.id ? 'active' : ''}`}
                            onClick={() => setSelectedTier(tier)}
                          >
                            <span className="amt-figure">{tier.amount} <small>AUD</small></span>
                            <span className="amt-name">{tier.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 02: Choose Gift Card Design */}
                    <div className="cust-field-group">
                      <div className="cust-group-header">
                        <span className="step-num">02</span>
                        <label className="cust-group-title">Choose Gift Card Design</label>
                      </div>
                      <div className="cust-design-grid">
                        {CARD_DESIGNS.map((design) => (
                          <button
                            key={design.id}
                            type="button"
                            className={`cust-design-btn ${selectedDesign.id === design.id ? 'active' : ''}`}
                            onClick={() => setSelectedDesign(design)}
                          >
                            <span
                              className="design-color-swatch"
                              style={{ background: design.swatch }}
                            ></span>
                            <div className="design-meta">
                              <strong>{design.name}</strong>
                              <span>{design.subtitle}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 03: Occasion & Delivery Mode */}
                    <div className="cust-field-group">
                      <div className="cust-group-header">
                        <span className="step-num">03</span>
                        <label className="cust-group-title">Occasion &amp; Delivery Method</label>
                      </div>

                      <div className="cust-occasion-pills">
                        {GIFT_OCCASIONS.map((occ) => (
                          <button
                            key={occ.id}
                            type="button"
                            className={`cust-occ-pill ${activeOccasion.id === occ.id ? 'active' : ''}`}
                            onClick={() => handleSelectOccasion(occ, false)}
                          >
                            {occ.label}
                          </button>
                        ))}
                      </div>

                      <div className="cust-recipient-mode-switch">
                        <button
                          type="button"
                          className={`mode-switch-btn ${deliveryType === 'Send to Recipient' ? 'active' : ''}`}
                          onClick={() => setDeliveryType('Send to Recipient')}
                        >
                          <strong>Send to Someone Special</strong>
                          <span>Deliver via email to recipient</span>
                        </button>
                        <button
                          type="button"
                          className={`mode-switch-btn ${deliveryType === 'Send to Myself' ? 'active' : ''}`}
                          onClick={() => setDeliveryType('Send to Myself')}
                        >
                          <strong>Send to Myself</strong>
                          <span>Receive via email to print or gift in person</span>
                        </button>
                      </div>
                    </div>

                    {/* Step 04: Recipient & Sender Information */}
                    <div className="cust-field-group">
                      <div className="cust-group-header">
                        <span className="step-num">04</span>
                        <label className="cust-group-title">Recipient &amp; Sender Details</label>
                      </div>

                      {deliveryType === 'Send to Recipient' && (
                        <div className="cust-input-row-2">
                          <div className="cust-input-wrap">
                            <label htmlFor="recipientName">Recipient Name *</label>
                            <input
                              id="recipientName"
                              type="text"
                              name="recipientName"
                              required
                              placeholder="e.g. Elena Rossi"
                              value={formData.recipientName}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="cust-input-wrap">
                            <label htmlFor="recipientEmail">Recipient Email *</label>
                            <input
                              id="recipientEmail"
                              type="email"
                              name="recipientEmail"
                              required
                              placeholder="e.g. elena@example.com"
                              value={formData.recipientEmail}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      )}

                      <div className="cust-input-row-2">
                        <div className="cust-input-wrap">
                          <label htmlFor="buyerName">Sender Name (Your Name) *</label>
                          <input
                            id="buyerName"
                            type="text"
                            name="buyerName"
                            required
                            placeholder="e.g. Marco Bellini"
                            value={formData.buyerName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="cust-input-wrap">
                          <label htmlFor="buyerEmail">Sender Email (For Receipt) *</label>
                          <input
                            id="buyerEmail"
                            type="email"
                            name="buyerEmail"
                            required
                            placeholder="e.g. marco@example.com"
                            value={formData.buyerEmail}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="cust-input-wrap">
                        <label htmlFor="buyerPhone">Sender Mobile Phone *</label>
                        <input
                          id="buyerPhone"
                          type="tel"
                          name="buyerPhone"
                          required
                          placeholder="e.g. 0412 345 678"
                          value={formData.buyerPhone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Step 05: Personal Message & Delivery Date */}
                    <div className="cust-field-group no-border">
                      <div className="cust-group-header">
                        <span className="step-num">05</span>
                        <label className="cust-group-title">Personal Message &amp; Delivery Date</label>
                      </div>

                      <div className="cust-input-wrap">
                        <div className="label-flex-between">
                          <label htmlFor="personalMessage">Personal Gift Message</label>
                          <span className="char-count">{formData.personalMessage.length}/220</span>
                        </div>
                        <textarea
                          id="personalMessage"
                          name="personalMessage"
                          rows="3"
                          maxLength="220"
                          placeholder="Write a personal note to appear on the gift voucher..."
                          value={formData.personalMessage}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="cust-schedule-bar">
                        <button
                          type="button"
                          className={`sched-chip ${deliverySchedule === 'Instant Delivery' ? 'active' : ''}`}
                          onClick={() => setDeliverySchedule('Instant Delivery')}
                        >
                          <span>Deliver Immediately</span>
                        </button>
                        <button
                          type="button"
                          className={`sched-chip ${deliverySchedule === 'Scheduled Date' ? 'active' : ''}`}
                          onClick={() => setDeliverySchedule('Scheduled Date')}
                        >
                          <span>Schedule Delivery Date</span>
                        </button>
                      </div>

                      {deliverySchedule === 'Scheduled Date' && (
                        <div className="cust-input-wrap" style={{ marginTop: '14px' }}>
                          <label htmlFor="scheduledDate">Preferred Delivery Date *</label>
                          <input
                            id="scheduledDate"
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    {submitError && (
                      <div className="cust-error-banner" role="alert">
                        <span>{submitError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn-editorial-submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>Registering Voucher &amp; Opening Stripe Checkout...</span>
                      ) : (
                        <>
                          <span>Purchase Gift Voucher — {selectedTier.amount} AUD</span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </>
                      )}
                    </button>

                    <div className="cust-security-note">
                      <span>
                        Secure Stripe Payment &bull; Instant order notification to <strong>request@baskk.co</strong> &bull; 36-Month Validity &bull;{' '}
                        <button
                          type="button"
                          className="inline-terms-link"
                          onClick={() => scrollToSection('voucher-terms')}
                        >
                          Terms &amp; Conditions
                        </button>
                      </span>
                    </div>
                  </form>
                )}
              </div>

              {/* RIGHT COLUMN: STICKY LIVE PREVIEW OF THE PERSONALIZED VOUCHER */}
              <div className="customizer-preview-col">
                <div className="sticky-voucher-stage">
                  <div className="stage-top-bar">
                    <span className="stage-indicator">
                      <span className="pulse-dot"></span>
                      LIVE PERSONALIZED GIFT CARD PREVIEW
                    </span>
                    <span className="stage-design-label">{selectedDesign.name}</span>
                  </div>

                  {/* THE LIVE BESPOKE DIGITAL VOUCHER CARD */}
                  <div
                    ref={previewCardRef}
                    className="live-luxury-voucher-card"
                    style={{
                      background: selectedDesign.bg,
                      color: selectedDesign.textColor,
                      borderColor: selectedDesign.borderColor
                    }}
                  >
                    <div
                      className="voucher-ornate-frame"
                      style={{ borderColor: selectedDesign.innerBorder }}
                    >
                      {/* Header */}
                      <div className="lv-header">
                        <div className="lv-brand">
                          <img src="/baskk_logo.png" alt="Baskk Italian" className="lv-logo" />
                          <div>
                            <span className="lv-brand-title">BASKK ITALIAN</span>
                            <span className="lv-brand-loc" style={{ color: selectedDesign.mutedColor }}>
                              MODERN ITALIAN DINING &amp; COCKTAILS
                            </span>
                          </div>
                        </div>

                        <div className="lv-value-box">
                          <span className="lv-cur" style={{ color: selectedDesign.accentColor }}>AUD</span>
                          <span className="lv-amt">{selectedTier.amount}</span>
                        </div>
                      </div>

                      {/* Center Body */}
                      <div className="lv-body">
                        <div
                          className="lv-occasion-tag"
                          style={{
                            borderColor: selectedDesign.borderColor,
                            color: selectedDesign.accentColor
                          }}
                        >
                          {activeOccasion.label}
                        </div>

                        <h4 className="lv-edition-title">{selectedTier.title}</h4>
                        <p className="lv-edition-sub" style={{ color: selectedDesign.mutedColor }}>
                          {selectedTier.subtitle}
                        </p>

                        <blockquote
                          className="lv-personal-message"
                          style={{ borderColor: selectedDesign.accentColor }}
                        >
                          “{formData.personalMessage || 'Wishing you an unforgettable evening of delicious Italian flavours and coastal hospitality at Baskk.'}”
                        </blockquote>

                        <div className="lv-participants-grid">
                          <div className="lv-part-col">
                            <span className="lv-part-lbl" style={{ color: selectedDesign.mutedColor }}>PREPARED FOR</span>
                            <span className="lv-part-val">
                              {deliveryType === 'Send to Myself'
                                ? (formData.buyerName || 'Valued Guest')
                                : (formData.recipientName || 'Recipient Name')}
                            </span>
                          </div>
                          <div className="lv-part-col">
                            <span className="lv-part-lbl" style={{ color: selectedDesign.mutedColor }}>WITH COMPLIMENTS OF</span>
                            <span className="lv-part-val">{formData.buyerName || 'Sender Name'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div
                        className="lv-footer"
                        style={{ borderTopColor: selectedDesign.innerBorder }}
                      >
                        <div className="lv-meta-item">
                          <span style={{ color: selectedDesign.mutedColor }}>VOUCHER REFERENCE</span>
                          <strong className="lv-code">{voucherCode}</strong>
                        </div>
                        <div className="lv-meta-item right">
                          <span style={{ color: selectedDesign.mutedColor }}>VALID UNTIL</span>
                          <strong>{expiryDate}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Below Card Details Strip */}
                  <div className="stage-details-card">
                    <div className="stage-detail-row">
                      <span className="sd-label">Redemption Location</span>
                      <span className="sd-val">52–58 Marine Parade, Coolangatta QLD 4225</span>
                    </div>
                    <div className="stage-detail-row">
                      <span className="sd-label">Delivery Schedule</span>
                      <span className="sd-val">
                        {deliverySchedule === 'Scheduled Date' && scheduledDate
                          ? `Scheduled (${scheduledDate})`
                          : 'Instant Digital Registration'}
                      </span>
                    </div>
                    <div className="stage-detail-row">
                      <span className="sd-label">Restaurant Notification</span>
                      <span className="sd-val">Instant email to request@baskk.co</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 4 – GIFT OCCASIONS
            "Every Occasion Deserves Something Special."
        ===================================================================== */}
        <section className="gifts-occasions-section" aria-label="Gift Occasions">
          <div className="gifts-container">
            <div className="section-editorial-header editorial-reveal-up">
              <span className="editorial-kicker">MOMENTS WORTH CELEBRATING</span>
              <h2 className="editorial-h2">Every Occasion Deserves Something Special.</h2>
              <p className="editorial-sub">
                Whether marking a milestone birthday, toasting an anniversary, or simply saying thank you, a table at Baskk turns any gesture into a lasting memory.
              </p>
            </div>

            {/* Occasion Tabs */}
            <div className="occasions-selector-bar editorial-reveal-up">
              {GIFT_OCCASIONS.map((occ) => (
                <button
                  key={occ.id}
                  type="button"
                  className={`occasion-tab-btn ${activeOccasion.id === occ.id ? 'active' : ''}`}
                  onClick={() => setActiveOccasion(occ)}
                >
                  {occ.label}
                </button>
              ))}
            </div>

            {/* Active Occasion Editorial Showcase */}
            <div className="occasion-feature-panel editorial-reveal-up">
              <div className="occasion-photo-col">
                <img
                  src={activeOccasion.image}
                  alt={activeOccasion.label}
                  className="occasion-feature-img"
                />
              </div>
              <div className="occasion-copy-col">
                <span className="occ-eyebrow">FOR {activeOccasion.label.toUpperCase()} GIFTING</span>
                <h3 className="occ-headline">{activeOccasion.tagline}</h3>
                <p className="occ-description">{activeOccasion.desc}</p>
                <div className="occ-suggested-note">
                  <span className="note-label">SUGGESTED CARD INSCRIPTION</span>
                  <p>“{activeOccasion.defaultQuote}”</p>
                </div>
                <button
                  type="button"
                  className="btn-editorial-primary"
                  onClick={() => handleSelectOccasion(activeOccasion, true)}
                >
                  <span>Personalize a {activeOccasion.label} Gift Card</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 5 – THE BASKK EXPERIENCE
            "Not Just a Gift. An Experience Worth Remembering."
        ===================================================================== */}
        <section className="gifts-experience-section" aria-label="The Baskk Dining Experience">
          <div className="gifts-container">
            <div className="experience-editorial-top editorial-reveal-up">
              <div className="exp-title-col">
                <span className="editorial-kicker">THE BASKK EXPERIENCE</span>
                <h2 className="editorial-h2">
                  Not Just a Gift. An Experience Worth Remembering.
                </h2>
              </div>
              <div className="exp-lead-col">
                <p>
                  More than a gift, it’s a moment to remember. Set along Coolangatta’s iconic Marine Parade, Baskk Italian brings together contemporary Italian cooking, warm coastal architecture, and the effortless rhythm of dining by the sea.
                </p>
              </div>
            </div>

            {/* Asymmetric Authentic Restaurant & Food Photo Collage */}
            <div className="experience-photo-mosaic">
              <div className="mosaic-item mosaic-large clip-reveal-img-wrap">
                <img
                  src="/baskk-new/baskk-beachfront-terrace.jpg"
                  alt="Baskk Italian Beachfront Dining Terrace"
                  className="parallax-dining-img"
                  loading="lazy"
                />
                <div className="mosaic-caption">
                  <span>01 / COASTAL SANCTUARY</span>
                  <h4>Oceanfront Dining on Marine Parade</h4>
                </div>
              </div>

              <div className="mosaic-item mosaic-tall clip-reveal-img-wrap">
                <img
                  src="/baskk-new/seafood-linguine-fresh.jpg"
                  alt="Freshly Crafted Seafood Pasta at Baskk Italian"
                  className="parallax-dining-img"
                  loading="lazy"
                />
                <div className="mosaic-caption">
                  <span>02 / ARTISAN KITCHEN</span>
                  <h4>House-Made Pasta &amp; Dough</h4>
                </div>
              </div>

              <div className="mosaic-item mosaic-wide clip-reveal-img-wrap">
                <img
                  src="/baskk-new/baskk-dining-room.jpg"
                  alt="Warm Italian Hospitality and Dining Room at Baskk"
                  className="parallax-dining-img"
                  loading="lazy"
                />
                <div className="mosaic-caption">
                  <span>03 / ATMOSPHERE &amp; HOSPITALITY</span>
                  <h4>Memorable Evenings, Shared Courses &amp; Signature Cocktails</h4>
                </div>
              </div>
            </div>

            {/* Three Core Gifting Benefits */}
            <div className="experience-benefits-grid editorial-reveal-up">
              <div className="benefit-editorial-card">
                <div className="benefit-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M20 12v10H4V12"></path>
                    <path d="M2 7h20v5H2z"></path>
                    <path d="M12 22V7"></path>
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                  </svg>
                </div>
                <h3>Perfect for Every Occasion</h3>
                <p>
                  From intimate dinners for two to lively group celebrations, a Baskk gift voucher adapts effortlessly to the recipient’s ideal night out.
                </p>
              </div>

              <div className="benefit-editorial-card">
                <div className="benefit-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </div>
                <h3>Easy Digital Delivery</h3>
                <p>
                  Personalize your gift online in moments. Choose to send to your recipient or to your own inbox, with instant registration and a printable digital card.
                </p>
              </div>

              <div className="benefit-editorial-card">
                <div className="benefit-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M8 22h8"></path>
                    <path d="M12 15v7"></path>
                    <path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"></path>
                  </svg>
                </div>
                <h3>Memorable Dining Experiences</h3>
                <p>
                  Redeemable across our complete dine-in food and cocktail menus for 3 full years, inviting guests to savour modern Italy at their leisure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 6 – HOW IT WORKS
            01 – Choose Your Gift | 02 – Personalize Your Message | 03 – Share the Experience
        ===================================================================== */}
        <section className="gifts-process-section" aria-label="How Gift Vouchers Work">
          <div className="gifts-container">
            <div className="section-editorial-header editorial-reveal-up">
              <span className="editorial-kicker">EFFORTLESS DIGITAL GIFTING</span>
              <h2 className="editorial-h2">How It Works</h2>
            </div>

            <div className="process-steps-row editorial-reveal-up">
              <div className="process-step-card">
                <div className="process-top-line">
                  <span className="process-number">01</span>
                  <div className="process-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                </div>
                <h3 className="process-title">Choose Your Gift</h3>
                <p className="process-desc">
                  Select from our curated $50, $100, or $200 AUD gift voucher editions and pick one of four Italian card aesthetics.
                </p>
              </div>

              <div className="process-step-card">
                <div className="process-top-line">
                  <span className="process-number">02</span>
                  <div className="process-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="process-title">Personalize Your Message</h3>
                <p className="process-desc">
                  Add the recipient’s name, select an occasion, and compose a heartfelt message while watching your live gift card update.
                </p>
              </div>

              <div className="process-step-card">
                <div className="process-top-line">
                  <span className="process-number">03</span>
                  <div className="process-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </div>
                </div>
                <h3 className="process-title">Share the Experience</h3>
                <p className="process-desc">
                  Complete your purchase securely via Stripe. Your unique voucher code is immediately registered with our restaurant team for seamless redemption.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 7 – GIFT VOUCHER FAQ (ACCORDION)
        ===================================================================== */}
        <section className="gifts-faq-accordion-section" aria-label="Gift Voucher Frequently Asked Questions">
          <div className="gifts-container faq-split-layout editorial-reveal-up">
            <div className="faq-intro-col">
              <span className="editorial-kicker">QUESTIONS &amp; DETAILS</span>
              <h2 className="editorial-h2">Gift Voucher Enquiries</h2>
              <p className="faq-intro-text">
                Everything you need to know about purchasing, personalizing, and redeeming a Baskk Italian digital gift card.
              </p>
              <div className="faq-contact-note">
                <span>Need assistance with a corporate or group gift order?</span>
                <a href="mailto:request@baskk.co">Contact request@baskk.co &rarr;</a>
              </div>
            </div>

            <div className="faq-accordion-col">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className={`faq-acc-item ${isOpen ? 'open' : ''}`}>
                    <button
                      type="button"
                      className="faq-acc-trigger"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.q}</span>
                      <span className="faq-acc-icon">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="faq-acc-body">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 8 – OFFICIAL GIFT VOUCHER TERMS & CONDITIONS
        ===================================================================== */}
        <section className="gifts-terms-section" id="voucher-terms" aria-label="Baskk Italian Gift Voucher Terms and Conditions">
          <div className="gifts-container">
            <div className="terms-editorial-sheet editorial-reveal-up">
              <div className="terms-sheet-header">
                <span className="editorial-kicker">BASKK ITALIAN</span>
                <h2 className="editorial-h2">Gift Voucher Terms &amp; Conditions</h2>
                <p className="terms-sheet-sub">
                  Coolangatta, Gold Coast, Queensland &bull; Official Digital Gift Voucher Policy
                </p>
              </div>

              <div className="terms-clauses-grid">
                {VOUCHER_TERMS.map((item, idx) => (
                  <div key={idx} className="terms-clause-card">
                    <div className="clause-num-row">
                      <span className="clause-index">{String(idx + 1).padStart(2, '0')}</span>
                      <h3 className="clause-title">{item.title}</h3>
                    </div>
                    <p className="clause-body">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 9 – FINAL EDITORIAL CTA
            "Make Their Next Dining Experience Special."
        ===================================================================== */}
        <section className="gifts-final-cta-section" aria-label="Buy a Gift Voucher Call to Action">
          <div className="final-cta-bg-wrap">
            <img
              src="/baskk-new/baskk-bar-ambiance.jpg"
              alt="Baskk Italian Evening Dining and Cocktail Bar Ambiance"
              className="final-cta-bg-img"
              loading="lazy"
            />
            <div className="final-cta-overlay"></div>
          </div>

          <div className="gifts-container final-cta-content editorial-reveal-up">
            <span className="final-cta-kicker">BASKK ITALIAN &bull; COOLANGATTA</span>
            <h2 className="final-cta-heading">Make Their Next Dining Experience Special.</h2>
            <p className="final-cta-sub">
              Thoughtfully designed, effortlessly delivered, and remembered long after the final course.
            </p>
            <div className="final-cta-buttons">
              <button
                type="button"
                className="btn-editorial-terracotta"
                onClick={() => scrollToSection('gift-customizer')}
              >
                <span>Buy Gift Voucher</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* SECTION 9 – EXISTING FOOTER */}
      <Footer onOpenBook={onOpenBook} />

      <style>{`
        /* =====================================================================
           LUXURY EDITORIAL DESIGN SYSTEM FOR /GIFTS
           Palette:
           - Warm Ivory: #F5F0E8
           - Charcoal: #191919
           - Terracotta: #B9674B
           - Muted Beige: #E5DCCE
           - White: #FFFFFF
           Typography:
           - Headings: 'Playfair Display', Georgia, serif
           - Body: 'Manrope', 'Inter', sans-serif
        ===================================================================== */
        .baskk-gifts-editorial-page {
          --gift-ivory: #F5F0E8;
          --gift-charcoal: #191919;
          --gift-terracotta: #B9674B;
          --gift-terracotta-dark: #9D5238;
          --gift-beige: #E5DCCE;
          --gift-white: #FFFFFF;
          --gift-muted: #5E564D;
          --font-editorial-serif: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
          --font-editorial-sans: 'Manrope', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

          background-color: var(--gift-ivory);
          color: var(--gift-charcoal);
          font-family: var(--font-editorial-sans);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .gifts-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* Editorial Typography Helpers */
        .editorial-kicker {
          display: inline-block;
          font-family: var(--font-editorial-sans);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gift-terracotta);
          margin-bottom: 14px;
        }

        .editorial-h2 {
          font-family: var(--font-editorial-serif);
          font-size: clamp(2.25rem, 4vw, 3.35rem);
          font-weight: 500;
          line-height: 1.12;
          letter-spacing: -0.015em;
          color: var(--gift-charcoal);
          margin: 0 0 18px 0;
        }

        .editorial-sub {
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--gift-muted);
          max-width: 660px;
          margin: 0 auto;
        }

        .section-editorial-header {
          text-align: center;
          margin-bottom: 64px;
        }

        /* Buttons */
        .btn-editorial-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background-color: var(--gift-charcoal);
          color: var(--gift-ivory);
          font-family: var(--font-editorial-sans);
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 17px 32px;
          border-radius: 999px;
          border: 1px solid var(--gift-charcoal);
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.25s ease;
        }

        .btn-editorial-primary:hover {
          background-color: var(--gift-terracotta);
          border-color: var(--gift-terracotta);
          color: var(--gift-white);
          transform: translateY(-2px);
        }

        .btn-editorial-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background-color: transparent;
          color: var(--gift-charcoal);
          font-family: var(--font-editorial-sans);
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 17px 28px;
          border-radius: 999px;
          border: 1px solid rgba(25, 25, 25, 0.3);
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-editorial-outline:hover {
          border-color: var(--gift-charcoal);
          background-color: rgba(25, 25, 25, 0.05);
        }

        .full-width {
          width: 100%;
        }

        /* =====================================================================
           SECTION 1: HERO
        ===================================================================== */
        .gifts-editorial-hero {
          padding: 156px 0 96px 0;
          background-color: var(--gift-ivory);
          border-bottom: 1px solid var(--gift-beige);
          position: relative;
        }

        .hero-split-grid {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 64px;
          align-items: center;
        }

        .gifts-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gift-terracotta);
          margin-bottom: 22px;
        }

        .eyebrow-line {
          width: 36px;
          height: 1px;
          background-color: var(--gift-terracotta);
        }

        .gifts-hero-heading {
          font-family: var(--font-editorial-serif);
          font-size: clamp(2.9rem, 5.2vw, 4.65rem);
          font-weight: 500;
          line-height: 1.06;
          letter-spacing: -0.02em;
          color: var(--gift-charcoal);
          margin: 0 0 24px 0;
        }

        .heading-italic-sub {
          display: block;
          font-style: italic;
          font-weight: 400;
          font-size: clamp(1.55rem, 2.7vw, 2.35rem);
          color: var(--gift-terracotta);
          margin-top: 10px;
          line-height: 1.22;
        }

        .gifts-hero-lead {
          font-size: 1.08rem;
          line-height: 1.75;
          color: var(--gift-muted);
          margin: 0 0 36px 0;
          max-width: 560px;
        }

        .gifts-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 48px;
        }

        .gifts-hero-meta {
          display: flex;
          align-items: center;
          gap: 28px;
          padding-top: 28px;
          border-top: 1px solid var(--gift-beige);
        }

        .meta-pillar {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .meta-num {
          font-family: var(--font-editorial-serif);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--gift-charcoal);
        }

        .meta-lbl {
          font-size: 0.75rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--gift-muted);
        }

        .meta-sep {
          width: 1px;
          height: 34px;
          background-color: var(--gift-beige);
        }

        /* Hero Right Visual + Floating Voucher Mockup */
        .gifts-hero-visual-wrap {
          position: relative;
          padding-bottom: 48px;
        }

        .hero-photo-frame {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 4 / 4.6;
          box-shadow: 0 28px 60px rgba(25, 25, 25, 0.12);
          background-color: var(--gift-beige);
        }

        .hero-main-photo {
          width: 100%;
          height: 112%;
          object-fit: cover;
          display: block;
        }

        .hero-photo-caption {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(25, 25, 25, 0.72);
          backdrop-filter: blur(8px);
          color: var(--gift-ivory);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          padding: 7px 14px;
          border-radius: 999px;
        }

        .hero-floating-voucher-mockup {
          position: absolute;
          bottom: 0;
          left: -36px;
          width: min(390px, 90%);
          background: linear-gradient(135deg, #191919 0%, #262220 100%);
          color: var(--gift-ivory);
          border-radius: 16px;
          padding: 10px;
          box-shadow: 0 24px 50px rgba(25, 25, 25, 0.28);
          border: 1px solid rgba(185, 103, 75, 0.45);
          cursor: pointer;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .hero-floating-voucher-mockup:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 60px rgba(25, 25, 25, 0.36);
        }

        .mockup-inner-border {
          border: 1px solid rgba(245, 240, 232, 0.16);
          border-radius: 11px;
          padding: 20px 22px;
        }

        .mockup-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .mockup-brand-cluster {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mockup-logo {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
          background: #FFFFFF;
        }

        .mockup-brand-title {
          display: block;
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.16em;
        }

        .mockup-brand-sub {
          display: block;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          color: #C7B9A8;
        }

        .mockup-edition-tag {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: var(--gift-terracotta);
          border: 1px solid rgba(185, 103, 75, 0.5);
          padding: 4px 9px;
          border-radius: 999px;
        }

        .mockup-center-art {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 16px;
        }

        .mockup-amount-display {
          display: flex;
          align-items: baseline;
          gap: 5px;
        }

        .mockup-amount-display .cur {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--gift-terracotta);
        }

        .mockup-amount-display .val {
          font-family: var(--font-editorial-serif);
          font-size: 2.35rem;
          font-weight: 500;
          line-height: 1;
        }

        .mockup-quote {
          font-family: var(--font-editorial-serif);
          font-style: italic;
          font-size: 0.85rem;
          color: #DFD5C7;
          margin: 0;
          text-align: right;
        }

        .mockup-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid rgba(245, 240, 232, 0.12);
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          color: #B8AA99;
        }

        .mockup-cta-link {
          color: var(--gift-terracotta);
          font-weight: 700;
        }

        /* =====================================================================
           SECTION 2: GIFT VOUCHER COLLECTION
        ===================================================================== */
        .gifts-collection-section {
          padding: 110px 0;
          background-color: var(--gift-white);
          border-bottom: 1px solid var(--gift-beige);
        }

        .collection-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          align-items: stretch;
        }

        .collection-bespoke-card {
          background-color: var(--gift-ivory);
          border: 1px solid var(--gift-beige);
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
        }

        .collection-bespoke-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 48px rgba(25, 25, 25, 0.09);
          border-color: var(--gift-terracotta);
        }

        .collection-bespoke-card.is-selected {
          border: 2px solid var(--gift-terracotta);
          box-shadow: 0 24px 52px rgba(185, 103, 75, 0.16);
        }

        .bespoke-voucher-artwork {
          position: relative;
          height: 250px;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .artwork-bg-photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .collection-bespoke-card:hover .artwork-bg-photo {
          transform: scale(1.06);
        }

        .artwork-overlay {
          position: absolute;
          inset: 0;
          background: rgba(25, 25, 25, 0.38);
        }

        .artwork-voucher-plate {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 310px;
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.32);
          border: 1px solid;
        }

        .plate-frame {
          border: 1px solid rgba(185, 103, 75, 0.35);
          border-radius: 8px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 158px;
        }

        .plate-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .plate-edition {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          opacity: 0.85;
        }

        .plate-badge {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(185, 103, 75, 0.22);
        }

        .plate-center {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin: 14px 0;
        }

        .plate-price {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .plate-cur {
          font-size: 0.68rem;
          font-weight: 700;
          opacity: 0.8;
        }

        .plate-amt {
          font-family: var(--font-editorial-serif);
          font-size: 2.3rem;
          font-weight: 500;
          line-height: 1;
        }

        .plate-brand-mark {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          opacity: 0.85;
        }

        .plate-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.58rem;
          letter-spacing: 0.16em;
          opacity: 0.72;
          padding-top: 8px;
          border-top: 1px solid rgba(185, 103, 75, 0.22);
        }

        .bespoke-card-content {
          padding: 30px 28px 28px 28px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .bespoke-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .bespoke-subtitle {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gift-terracotta);
          margin-bottom: 4px;
        }

        .bespoke-title {
          font-family: var(--font-editorial-serif);
          font-size: 1.55rem;
          font-weight: 500;
          color: var(--gift-charcoal);
          margin: 0;
          line-height: 1.2;
        }

        .bespoke-amount-tag {
          font-family: var(--font-editorial-serif);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--gift-charcoal);
        }

        .bespoke-desc {
          font-size: 0.93rem;
          line-height: 1.65;
          color: var(--gift-muted);
          margin: 0 0 22px 0;
          flex-grow: 1;
        }

        .bespoke-highlights {
          list-style: none;
          padding: 16px 0 0 0;
          margin: 0 0 24px 0;
          border-top: 1px solid var(--gift-beige);
        }

        .bespoke-highlights li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.84rem;
          color: var(--gift-charcoal);
          margin-bottom: 8px;
          font-weight: 500;
        }

        .bullet-diamond {
          color: var(--gift-terracotta);
          font-size: 0.65rem;
        }

        .btn-select-gift {
          width: 100%;
          padding: 15px 20px;
          border-radius: 999px;
          border: 1px solid var(--gift-charcoal);
          background-color: transparent;
          color: var(--gift-charcoal);
          font-family: var(--font-editorial-sans);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .btn-select-gift:hover,
        .btn-select-gift.selected {
          background-color: var(--gift-charcoal);
          color: var(--gift-ivory);
        }

        /* =====================================================================
           SECTION 3: INTERACTIVE GIFT CARD CUSTOMIZER
        ===================================================================== */
        .gifts-customizer-section {
          padding: 110px 0;
          background-color: var(--gift-ivory);
          border-bottom: 1px solid var(--gift-beige);
        }

        .customizer-two-col-layout {
          display: grid;
          grid-template-columns: 1.12fr 0.88fr;
          gap: 56px;
          align-items: start;
        }

        .customizer-editorial-form {
          background-color: var(--gift-white);
          border: 1px solid var(--gift-beige);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 18px 44px rgba(25, 25, 25, 0.05);
        }

        .cust-field-group {
          margin-bottom: 32px;
          padding-bottom: 30px;
          border-bottom: 1px solid var(--gift-beige);
        }

        .cust-field-group.no-border {
          border-bottom: none;
          padding-bottom: 10px;
        }

        .cust-group-header {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 18px;
        }

        .step-num {
          font-family: var(--font-editorial-serif);
          font-style: italic;
          font-size: 1.15rem;
          color: var(--gift-terracotta);
          font-weight: 600;
        }

        .cust-group-title {
          font-family: var(--font-editorial-serif);
          font-size: 1.35rem;
          font-weight: 500;
          color: var(--gift-charcoal);
        }

        .cust-amount-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .cust-amount-btn {
          padding: 16px 14px;
          border-radius: 12px;
          border: 1px solid var(--gift-beige);
          background-color: var(--gift-ivory);
          color: var(--gift-charcoal);
          cursor: pointer;
          text-align: left;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cust-amount-btn.active {
          background-color: var(--gift-charcoal);
          color: var(--gift-ivory);
          border-color: var(--gift-charcoal);
        }

        .amt-figure {
          font-family: var(--font-editorial-serif);
          font-size: 1.5rem;
          font-weight: 600;
        }

        .amt-figure small {
          font-family: var(--font-editorial-sans);
          font-size: 0.7rem;
          opacity: 0.75;
        }

        .amt-name {
          font-size: 0.76rem;
          opacity: 0.85;
          font-weight: 500;
        }

        /* Design Swatch Selector */
        .cust-design-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .cust-design-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid var(--gift-beige);
          background-color: var(--gift-white);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }

        .cust-design-btn.active {
          border: 1.5px solid var(--gift-terracotta);
          background-color: var(--gift-ivory);
        }

        .design-color-swatch {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid rgba(25, 25, 25, 0.2);
          flex-shrink: 0;
        }

        .design-meta strong {
          display: block;
          font-size: 0.86rem;
          color: var(--gift-charcoal);
        }

        .design-meta span {
          font-size: 0.73rem;
          color: var(--gift-muted);
        }

        /* Occasion Pills */
        .cust-occasion-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .cust-occ-pill {
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid var(--gift-beige);
          background-color: var(--gift-white);
          color: var(--gift-charcoal);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cust-occ-pill.active {
          background-color: var(--gift-terracotta);
          border-color: var(--gift-terracotta);
          color: var(--gift-white);
        }

        .cust-recipient-mode-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .mode-switch-btn {
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid var(--gift-beige);
          background-color: var(--gift-white);
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mode-switch-btn strong {
          display: block;
          font-size: 0.88rem;
          color: var(--gift-charcoal);
          margin-bottom: 2px;
        }

        .mode-switch-btn span {
          font-size: 0.75rem;
          color: var(--gift-muted);
        }

        .mode-switch-btn.active {
          border: 1.5px solid var(--gift-charcoal);
          background-color: var(--gift-ivory);
        }

        /* Form Inputs */
        .cust-input-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }

        .cust-input-wrap label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--gift-charcoal);
          margin-bottom: 6px;
        }

        .label-flex-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .char-count {
          font-size: 0.72rem;
          color: var(--gift-muted);
        }

        .cust-input-wrap input,
        .cust-input-wrap textarea {
          width: 100%;
          padding: 13px 15px;
          border-radius: 10px;
          border: 1px solid var(--gift-beige);
          background-color: var(--gift-ivory);
          color: var(--gift-charcoal);
          font-family: var(--font-editorial-sans);
          font-size: 0.92rem;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }

        .cust-input-wrap input:focus,
        .cust-input-wrap textarea:focus {
          outline: none;
          border-color: var(--gift-terracotta);
          background-color: var(--gift-white);
        }

        .cust-schedule-bar {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 14px;
        }

        .sched-chip {
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid var(--gift-beige);
          background-color: var(--gift-white);
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--gift-charcoal);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sched-chip.active {
          border-color: var(--gift-terracotta);
          background-color: var(--gift-ivory);
          color: var(--gift-terracotta);
        }

        .cust-error-banner {
          background-color: #FDF2EF;
          border: 1px solid var(--gift-terracotta);
          color: #8B3A22;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 0.86rem;
          margin-bottom: 18px;
        }

        .btn-editorial-submit {
          width: 100%;
          padding: 18px 28px;
          border-radius: 999px;
          border: none;
          background-color: var(--gift-terracotta);
          color: var(--gift-white);
          font-family: var(--font-editorial-sans);
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
          margin-top: 10px;
        }

        .btn-editorial-submit:hover {
          background-color: var(--gift-terracotta-dark);
          transform: translateY(-2px);
        }

        .cust-security-note {
          margin-top: 14px;
          text-align: center;
          font-size: 0.78rem;
          color: var(--gift-muted);
        }

        /* Sticky Right Column: Live Personalized Gift Card Preview */
        .sticky-voucher-stage {
          position: sticky;
          top: 112px;
        }

        .stage-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gift-muted);
        }

        .stage-indicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--gift-charcoal);
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--gift-terracotta);
        }

        .live-luxury-voucher-card {
          border-radius: 20px;
          padding: 14px;
          border: 1px solid;
          box-shadow: 0 28px 60px rgba(25, 25, 25, 0.2);
          transition: background 0.4s ease, color 0.4s ease;
        }

        .voucher-ornate-frame {
          border: 1px solid;
          border-radius: 14px;
          padding: 30px 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .lv-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 26px;
        }

        .lv-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .lv-logo {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          background: #FFFFFF;
        }

        .lv-brand-title {
          display: block;
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.16em;
        }

        .lv-brand-loc {
          display: block;
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          margin-top: 2px;
        }

        .lv-value-box {
          text-align: right;
        }

        .lv-cur {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        .lv-amt {
          font-family: var(--font-editorial-serif);
          font-size: 2.75rem;
          font-weight: 500;
          line-height: 1;
        }

        .lv-occasion-tag {
          display: inline-block;
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid;
          margin-bottom: 12px;
        }

        .lv-edition-title {
          font-family: var(--font-editorial-serif);
          font-size: 1.7rem;
          font-weight: 500;
          margin: 0 0 4px 0;
        }

        .lv-edition-sub {
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0 0 20px 0;
        }

        .lv-personal-message {
          font-family: var(--font-editorial-serif);
          font-style: italic;
          font-size: 1.02rem;
          line-height: 1.55;
          margin: 0 0 24px 0;
          padding-left: 16px;
          border-left: 2px solid;
        }

        .lv-participants-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .lv-part-lbl {
          display: block;
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          margin-bottom: 4px;
        }

        .lv-part-val {
          font-size: 0.95rem;
          font-weight: 600;
        }

        .lv-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid;
        }

        .lv-meta-item span {
          display: block;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          margin-bottom: 3px;
        }

        .lv-meta-item.right {
          text-align: right;
        }

        .lv-code {
          font-family: monospace;
          font-size: 0.92rem;
          letter-spacing: 0.08em;
        }

        .stage-details-card {
          margin-top: 20px;
          background-color: var(--gift-white);
          border: 1px solid var(--gift-beige);
          border-radius: 14px;
          padding: 18px 22px;
        }

        .stage-detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--gift-ivory);
          font-size: 0.82rem;
        }

        .stage-detail-row:last-child {
          border-bottom: none;
        }

        .sd-label {
          color: var(--gift-muted);
        }

        .sd-val {
          font-weight: 600;
          color: var(--gift-charcoal);
        }

        /* Confirmation Panel */
        .customizer-confirmation-panel {
          background-color: var(--gift-white);
          border: 1.5px solid var(--gift-terracotta);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
        }

        .conf-crest-badge {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: var(--gift-terracotta);
          color: var(--gift-white);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }

        .conf-kicker {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: var(--gift-terracotta);
        }

        .conf-heading {
          font-family: var(--font-editorial-serif);
          font-size: 2rem;
          margin: 8px 0 12px 0;
        }

        .conf-text {
          font-size: 0.94rem;
          line-height: 1.65;
          color: var(--gift-muted);
          margin-bottom: 24px;
        }

        .conf-ledger-box {
          background-color: var(--gift-ivory);
          border: 1px solid var(--gift-beige);
          border-radius: 12px;
          padding: 18px 20px;
          margin-bottom: 24px;
          text-align: left;
        }

        .ledger-row {
          display: flex;
          justify-content: space-between;
          padding: 7px 0;
          border-bottom: 1px solid var(--gift-beige);
          font-size: 0.86rem;
        }

        .ledger-row:last-child {
          border-bottom: none;
        }

        .mono-code {
          font-family: monospace;
          color: var(--gift-terracotta);
        }

        .conf-button-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .btn-text-reset {
          background: none;
          border: none;
          color: var(--gift-muted);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          padding: 8px;
          text-decoration: underline;
        }

        /* =====================================================================
           SECTION 4: GIFT OCCASIONS
        ===================================================================== */
        .gifts-occasions-section {
          padding: 110px 0;
          background-color: var(--gift-white);
          border-bottom: 1px solid var(--gift-beige);
        }

        .occasions-selector-bar {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 44px;
        }

        .occasion-tab-btn {
          padding: 12px 26px;
          border-radius: 999px;
          border: 1px solid var(--gift-beige);
          background-color: var(--gift-ivory);
          color: var(--gift-charcoal);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .occasion-tab-btn.active,
        .occasion-tab-btn:hover {
          background-color: var(--gift-charcoal);
          color: var(--gift-ivory);
          border-color: var(--gift-charcoal);
        }

        .occasion-feature-panel {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background-color: var(--gift-ivory);
          border: 1px solid var(--gift-beige);
          border-radius: 22px;
          overflow: hidden;
        }

        .occasion-photo-col {
          min-height: 420px;
          overflow: hidden;
        }

        .occasion-feature-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .occasion-copy-col {
          padding: 56px 52px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
        }

        .occ-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: var(--gift-terracotta);
          margin-bottom: 10px;
        }

        .occ-headline {
          font-family: var(--font-editorial-serif);
          font-size: clamp(1.85rem, 3vw, 2.5rem);
          font-weight: 500;
          margin: 0 0 14px 0;
          line-height: 1.18;
        }

        .occ-description {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--gift-muted);
          margin: 0 0 24px 0;
        }

        .occ-suggested-note {
          background-color: var(--gift-white);
          border-left: 3px solid var(--gift-terracotta);
          padding: 16px 20px;
          border-radius: 0 10px 10px 0;
          margin-bottom: 28px;
          width: 100%;
        }

        .note-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: var(--gift-terracotta);
          margin-bottom: 6px;
        }

        .occ-suggested-note p {
          font-family: var(--font-editorial-serif);
          font-style: italic;
          font-size: 0.98rem;
          margin: 0;
          color: var(--gift-charcoal);
        }

        /* =====================================================================
           SECTION 5: THE BASKK EXPERIENCE
        ===================================================================== */
        .gifts-experience-section {
          padding: 110px 0;
          background-color: var(--gift-ivory);
          border-bottom: 1px solid var(--gift-beige);
        }

        .experience-editorial-top {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 48px;
          align-items: end;
          margin-bottom: 56px;
        }

        .exp-lead-col p {
          font-size: 1.05rem;
          line-height: 1.75;
          color: var(--gift-muted);
          margin: 0;
        }

        .experience-photo-mosaic {
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          grid-template-rows: 320px 300px;
          gap: 24px;
          margin-bottom: 64px;
        }

        .mosaic-item {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          background-color: var(--gift-beige);
        }

        .mosaic-large {
          grid-column: 1 / 2;
          grid-row: 1 / 3;
        }

        .mosaic-tall {
          grid-column: 2 / 3;
          grid-row: 1 / 2;
        }

        .mosaic-wide {
          grid-column: 2 / 3;
          grid-row: 2 / 3;
        }

        .mosaic-item img {
          width: 100%;
          height: 114%;
          object-fit: cover;
          display: block;
        }

        .mosaic-caption {
          position: absolute;
          inset: auto 0 0 0;
          padding: 28px 24px 22px 24px;
          background: linear-gradient(180deg, rgba(25, 25, 25, 0) 0%, rgba(25, 25, 25, 0.78) 100%);
          color: var(--gift-ivory);
        }

        .mosaic-caption span {
          display: block;
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #E5DCCE;
          margin-bottom: 4px;
        }

        .mosaic-caption h4 {
          font-family: var(--font-editorial-serif);
          font-size: 1.35rem;
          font-weight: 500;
          margin: 0;
        }

        .experience-benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .benefit-editorial-card {
          background-color: var(--gift-white);
          border: 1px solid var(--gift-beige);
          border-radius: 16px;
          padding: 34px 30px;
        }

        .benefit-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background-color: var(--gift-ivory);
          color: var(--gift-terracotta);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .benefit-editorial-card h3 {
          font-family: var(--font-editorial-serif);
          font-size: 1.4rem;
          font-weight: 500;
          margin: 0 0 10px 0;
        }

        .benefit-editorial-card p {
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--gift-muted);
          margin: 0;
        }

        /* =====================================================================
           SECTION 6: HOW IT WORKS (01, 02, 03)
        ===================================================================== */
        .gifts-process-section {
          padding: 100px 0;
          background-color: var(--gift-white);
          border-bottom: 1px solid var(--gift-beige);
        }

        .process-steps-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 36px;
        }

        .process-step-card {
          padding: 36px 32px;
          background-color: var(--gift-ivory);
          border: 1px solid var(--gift-beige);
          border-radius: 18px;
        }

        .process-top-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 20px;
          margin-bottom: 22px;
          border-bottom: 1px solid var(--gift-beige);
        }

        .process-number {
          font-family: var(--font-editorial-serif);
          font-size: 2.2rem;
          font-weight: 500;
          color: var(--gift-terracotta);
          line-height: 1;
        }

        .process-icon {
          color: var(--gift-charcoal);
        }

        .process-title {
          font-family: var(--font-editorial-serif);
          font-size: 1.45rem;
          font-weight: 500;
          margin: 0 0 10px 0;
        }

        .process-desc {
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--gift-muted);
          margin: 0;
        }

        /* =====================================================================
           SECTION 7: GIFT VOUCHER FAQ ACCORDION
        ===================================================================== */
        .gifts-faq-accordion-section {
          padding: 110px 0;
          background-color: var(--gift-ivory);
        }

        .faq-split-layout {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 64px;
          align-items: start;
        }

        .faq-intro-col .editorial-h2 {
          text-align: left;
        }

        .faq-intro-text {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--gift-muted);
          margin: 0 0 28px 0;
        }

        .faq-contact-note {
          padding: 20px 22px;
          background-color: var(--gift-white);
          border: 1px solid var(--gift-beige);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.88rem;
        }

        .faq-contact-note a {
          color: var(--gift-terracotta);
          font-weight: 700;
          text-decoration: none;
        }

        .faq-acc-item {
          background-color: var(--gift-white);
          border: 1px solid var(--gift-beige);
          border-radius: 14px;
          margin-bottom: 12px;
          overflow: hidden;
        }

        .faq-acc-trigger {
          width: 100%;
          padding: 22px 24px;
          background: none;
          border: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          text-align: left;
          font-family: var(--font-editorial-serif);
          font-size: 1.18rem;
          font-weight: 500;
          color: var(--gift-charcoal);
          cursor: pointer;
        }

        .faq-acc-icon {
          font-family: var(--font-editorial-sans);
          font-size: 1.35rem;
          color: var(--gift-terracotta);
          flex-shrink: 0;
        }

        .faq-acc-body {
          padding: 0 24px 22px 24px;
        }

        .faq-acc-body p {
          margin: 0;
          font-size: 0.94rem;
          line-height: 1.7;
          color: var(--gift-muted);
        }

        /* =====================================================================
           SECTION 8: FINAL EDITORIAL CTA
        ===================================================================== */
        .gifts-final-cta-section {
          position: relative;
          padding: 130px 0;
          color: var(--gift-ivory);
          text-align: center;
          overflow: hidden;
        }

        .final-cta-bg-wrap {
          position: absolute;
          inset: 0;
        }

        .final-cta-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .final-cta-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(25, 25, 25, 0.72) 0%, rgba(25, 25, 25, 0.84) 100%);
        }

        .final-cta-content {
          position: relative;
          z-index: 2;
          max-width: 780px;
        }

        .final-cta-kicker {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #E5DCCE;
          margin-bottom: 16px;
        }

        .final-cta-heading {
          font-family: var(--font-editorial-serif);
          font-size: clamp(2.4rem, 4.5vw, 3.8rem);
          font-weight: 500;
          line-height: 1.12;
          margin: 0 0 18px 0;
          color: var(--gift-white);
        }

        .final-cta-sub {
          font-size: 1.08rem;
          line-height: 1.65;
          color: #E5DCCE;
          margin: 0 0 36px 0;
        }

        .btn-editorial-terracotta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background-color: var(--gift-terracotta);
          color: var(--gift-white);
          font-family: var(--font-editorial-sans);
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 18px 38px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.25s ease;
        }

        .btn-editorial-terracotta:hover {
          background-color: var(--gift-terracotta-dark);
          transform: translateY(-2px);
        }

        /* =====================================================================
           OFFICIAL GIFT VOUCHER TERMS & CONDITIONS SHEET
        ===================================================================== */
        .inline-terms-link {
          background: none;
          border: none;
          padding: 0;
          color: var(--gift-terracotta);
          font-family: inherit;
          font-size: inherit;
          font-weight: 700;
          text-decoration: underline;
          cursor: pointer;
        }

        .inline-terms-link:hover {
          color: var(--gift-charcoal);
        }

        .gifts-terms-section {
          padding: 96px 0 112px 0;
          background-color: var(--gift-white);
          border-top: 1px solid var(--gift-beige);
          border-bottom: 1px solid var(--gift-beige);
        }

        .terms-editorial-sheet {
          background-color: var(--gift-ivory);
          border: 1px solid var(--gift-beige);
          border-radius: 22px;
          padding: 56px 52px;
          box-shadow: 0 18px 44px rgba(25, 25, 25, 0.04);
        }

        .terms-sheet-header {
          text-align: center;
          padding-bottom: 36px;
          margin-bottom: 40px;
          border-bottom: 1px solid var(--gift-beige);
        }

        .terms-sheet-sub {
          margin: 0;
          font-size: 0.88rem;
          letter-spacing: 0.06em;
          color: var(--gift-muted);
        }

        .terms-clauses-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px 36px;
        }

        .terms-clause-card {
          background-color: var(--gift-white);
          border: 1px solid var(--gift-beige);
          border-radius: 14px;
          padding: 22px 24px;
          transition: border-color 0.25s ease;
        }

        .terms-clause-card:hover {
          border-color: var(--gift-terracotta);
        }

        .clause-num-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 8px;
        }

        .clause-index {
          font-family: var(--font-editorial-serif);
          font-style: italic;
          font-size: 0.98rem;
          font-weight: 600;
          color: var(--gift-terracotta);
        }

        .clause-title {
          font-family: var(--font-editorial-serif);
          font-size: 1.18rem;
          font-weight: 600;
          color: var(--gift-charcoal);
          margin: 0;
        }

        .clause-body {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.68;
          color: var(--gift-muted);
        }

        /* =====================================================================
           RESPONSIVE DESIGN
        ===================================================================== */
        @media (max-width: 1080px) {
          .hero-split-grid,
          .customizer-two-col-layout,
          .occasion-feature-panel,
          .experience-editorial-top,
          .faq-split-layout,
          .terms-clauses-grid {
            grid-template-columns: 1fr;
          }

          .collection-cards-grid,
          .experience-benefits-grid,
          .process-steps-row {
            grid-template-columns: 1fr;
            max-width: 620px;
            margin-left: auto;
            margin-right: auto;
          }

          .experience-photo-mosaic {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
          }

          .mosaic-large,
          .mosaic-tall,
          .mosaic-wide {
            grid-column: auto;
            grid-row: auto;
            height: 320px;
          }

          .hero-floating-voucher-mockup {
            left: 16px;
            right: 16px;
            width: auto;
          }
        }

        @media (max-width: 680px) {
          .gifts-container {
            padding: 0 20px;
          }

          .gifts-editorial-hero {
            padding: 132px 0 72px 0;
          }

          .customizer-editorial-form {
            padding: 26px 20px;
          }

          .cust-amount-grid,
          .cust-design-grid,
          .cust-recipient-mode-switch,
          .cust-input-row-2,
          .cust-schedule-bar,
          .lv-participants-grid {
            grid-template-columns: 1fr;
          }

          .occasion-copy-col,
          .terms-editorial-sheet {
            padding: 32px 20px;
          }

          .gifts-hero-meta {
            flex-wrap: wrap;
            gap: 18px;
          }
        }
      `}</style>
    </div>
  );
}
