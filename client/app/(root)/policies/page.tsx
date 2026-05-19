"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PolicySection {
  id:       string;
  icon:     string;
  title:    string;
  subtitle: string;
  articles: { heading: string; body: string }[];
}

// ─── Policy content ───────────────────────────────────────────────────────────

const LAST_UPDATED = "15 Janvier 2026";
const VERSION      = "v3.2";

const SECTIONS: PolicySection[] = [
  {
    id:       "introduction",
    icon:     "gavel",
    title:    "Introduction & Legal Framework",
    subtitle: "Cadre juridique et conditions générales",
    articles: [
      {
        heading: "1.1 — Platform Authority",
        body: "AGRIGOV is the official national digital agricultural marketplace of the People's Democratic Republic of Algeria, operated under the authority of the Ministry of Agriculture and Rural Development (MADR). All operations, transactions, and user activities conducted on this platform are subject to Algerian law, including but not limited to the Commercial Code, the Consumer Protection Act (Law 09-03), and the Electronic Commerce Ordinance (Ord. 21-08).",
      },
      {
        heading: "1.2 — Scope of Application",
        body: "These policies apply to all natural and legal persons who access, register on, or transact through the AGRIGOV platform, regardless of their role — Farmer (Fellah), Buyer (Acheteur), Transporter (Transporteur), or Ministry Agent. By creating an account or completing any transaction, you unconditionally accept all terms herein in their entirety.",
      },
      {
        heading: "1.3 — Policy Updates",
        body: "The Ministry reserves the right to amend these policies at any time in accordance with evolving regulatory requirements or platform improvements. Users will be notified of material changes via the platform's notification system and by email. Continued use of the platform following notification constitutes acceptance of the revised terms.",
      },
    ],
  },
  {
    id:       "eligibility",
    icon:     "how_to_reg",
    title:    "Registration & Eligibility",
    subtitle: "Conditions d'inscription et d'éligibilité",
    articles: [
      {
        heading: "2.1 — Eligibility Requirements",
        body: "Registration is open to Algerian citizens and legally registered companies operating within the territory of Algeria. Farmers must hold a valid Carte d'Agriculteur issued by MADR or a provincial agricultural directorate (Direction des Services Agricoles). Buyers must be registered commercial entities or licensed agri-food businesses. Transporters must possess a valid commercial transport permit (Autorisation de Transports de Marchandises).",
      },
      {
        heading: "2.2 — Account Verification",
        body: "All accounts are subject to mandatory identity and document verification by Ministry agents before full platform access is granted. Submission of false or misleading documents constitutes a criminal offence under Algerian law and will result in immediate and permanent account termination, as well as referral to the appropriate judicial authorities.",
      },
      {
        heading: "2.3 — One Account per Entity",
        body: "Each individual or legal entity is permitted to hold a maximum of one account per role. Duplicate accounts are strictly prohibited and will be merged or deleted at the Ministry's discretion. Users may hold accounts in multiple roles (e.g. a farmer who also acts as a buyer) provided each account is separately registered and verified.",
      },
      {
        heading: "2.4 — Account Security",
        body: "You are solely responsible for maintaining the confidentiality of your login credentials. AGRIGOV will never request your password via email, SMS, or telephone. Any unauthorized access must be reported immediately to support@agrigov.dz. The Ministry accepts no liability for losses arising from credential compromise due to user negligence.",
      },
    ],
  },
  {
    id:       "marketplace",
    icon:     "storefront",
    title:    "Marketplace Rules",
    subtitle: "Règles du marché et des transactions",
    articles: [
      {
        heading: "3.1 — Product Listing Standards",
        body: "All products listed on the AGRIGOV marketplace must correspond to approved ministry-registered commodity categories. Product descriptions must be accurate, complete, and not misleading. Photographs must represent the actual product being sold. Listing of counterfeit, adulterated, or non-compliant agricultural products is strictly prohibited and subject to legal prosecution.",
      },
      {
        heading: "3.2 — Pricing Compliance",
        body: "All listed prices must comply with the Official Price Index published by the Ministry's price regulation division. Prices deviating more than 15% above or below the published reference price for a given commodity and region require advance written justification submitted via the platform. Persistent non-compliance will result in listing suspension.",
      },
      {
        heading: "3.3 — Order Obligations",
        body: "Once a buyer confirms an order and a farmer accepts it, both parties are contractually bound to honour the transaction under the terms agreed at the time of confirmation. Cancellation after acceptance is permitted only in cases of documented force majeure, crop failure verified by an agricultural inspector, or mutual written agreement.",
      },
      {
        heading: "3.4 — Quality Assurance",
        body: "Farmers warrant that all products delivered conform to the specifications listed at the time of sale, including weight, grade, moisture content, and phytosanitary status. Buyers are entitled to raise a formal quality dispute within 48 hours of delivery. Disputes are adjudicated by the AGRIGOV Quality Commission, whose decision is binding on both parties.",
      },
      {
        heading: "3.5 — Prohibited Products",
        body: "The platform strictly prohibits the listing or sale of: narcotics or controlled substances; products subject to active trade embargoes or import/export restrictions; goods not conforming to Algerian phytosanitary standards; counterfeit seeds, fertilisers, or pesticides; and any commodity whose trade is regulated by special licence not held by the seller.",
      },
    ],
  },
  {
    id:       "payments",
    icon:     "account_balance",
    title:    "Payments & Financial Terms",
    subtitle: "Conditions financières et modalités de paiement",
    articles: [
      {
        heading: "4.1 — Accepted Payment Methods",
        body: "AGRIGOV processes payments exclusively through officially licensed Algerian banking channels, including CCP (Algérie Poste), BNA, BEA, BADR, and CPA. International payment instruments and cryptocurrency are not accepted. All transactions are denominated in Algerian Dinars (DZD) and subject to applicable Algerian banking regulations.",
      },
      {
        heading: "4.2 — Payment Processing & Escrow",
        body: "Upon order confirmation, payment is held in a secure Ministry-supervised escrow account. Funds are released to the seller upon confirmed delivery and expiry of the 48-hour quality dispute window. In the event of a dispute, funds remain in escrow until resolution by the Quality Commission.",
      },
      {
        heading: "4.3 — Platform Fees",
        body: "AGRIGOV charges a transaction fee of 1.5% on the total value of each completed sale, deducted automatically from the seller's payout. There are no listing fees. Ministry-subsidised small-scale farmers (farms under 5 hectares) registered with the Small Farm Subsidy Programme benefit from a reduced transaction fee of 0.75% for the duration of their subsidy eligibility.",
      },
      {
        heading: "4.4 — Taxes & Fiscal Obligations",
        body: "Users are solely responsible for complying with all applicable Algerian tax laws, including TVA (if applicable), impôt forfaitaire unique (IFU), or professional tax obligations arising from transactions conducted on the platform. AGRIGOV provides annual transaction summaries to facilitate tax declarations but does not provide tax advice.",
      },
      {
        heading: "4.5 — Refunds & Chargebacks",
        body: "Refunds are issued exclusively following a Quality Commission ruling in favour of the buyer, or in cases of non-delivery confirmed by the platform's logistics tracking system. Refund processing takes 5–10 working days. Unauthorised chargebacks raised directly with banking institutions without first exhausting the platform's dispute resolution process will be contested and may result in account suspension.",
      },
    ],
  },
  {
    id:       "transport",
    icon:     "local_shipping",
    title:    "Transport & Logistics",
    subtitle: "Transport et logistique des marchandises",
    articles: [
      {
        heading: "5.1 — Transporter Obligations",
        body: "Registered transporters must maintain valid insurance covering cargo in transit, a current Carte Grise for all vehicles used, and a valid transport licence throughout their period of activity on the platform. Vehicles used for refrigerated goods must hold a valid ATP certificate where applicable under Algerian regulations.",
      },
      {
        heading: "5.2 — Mission Acceptance & Cancellation",
        body: "Once a transporter accepts a delivery mission, they are contractually obligated to complete it unless prevented by documented force majeure. Cancellation of accepted missions without valid cause, exceeding two occurrences within a 30-day period, will result in temporary suspension of the transporter's account pending review.",
      },
      {
        heading: "5.3 — Liability for Goods in Transit",
        body: "The transporter assumes full liability for goods from the moment of collection from the farm until delivery confirmation by the buyer. Any damage, loss, or contamination occurring during transit is the transporter's financial responsibility, recoverable from their cargo insurance. The platform provides a standardised Bill of Lading for all missions.",
      },
      {
        heading: "5.4 — Delivery Confirmation",
        body: "Delivery is confirmed via the platform's digital confirmation system, requiring photographic evidence of the delivered goods and the buyer's digital signature. SMS-based confirmation is available as a fallback in areas with limited connectivity. Disputed deliveries trigger automatic escrow extension and Quality Commission review.",
      },
    ],
  },
  {
    id:       "data",
    icon:     "security",
    title:    "Data Protection & Privacy",
    subtitle: "Protection des données personnelles",
    articles: [
      {
        heading: "6.1 — Data Controller",
        body: "The Ministry of Agriculture and Rural Development (MADR) acts as the data controller for all personal data collected through AGRIGOV, in accordance with the Algerian Personal Data Protection Law (Law 18-07). The Data Protection Officer can be reached at dpo@agrigov.dz.",
      },
      {
        heading: "6.2 — Data Collected",
        body: "AGRIGOV collects identity documents, professional licences, banking details, transaction records, farm location data, communication logs, and device/usage metadata strictly necessary for platform operation and regulatory compliance. We do not sell, rent, or share personal data with third parties for commercial purposes.",
      },
      {
        heading: "6.3 — Data Retention",
        body: "Transaction records and identity documents are retained for a minimum of 10 years to comply with Algerian commercial and fiscal law. Account data for inactive accounts is retained for 5 years following the last transaction before being anonymised. Users may request deletion of non-mandatory data at any time by contacting dpo@agrigov.dz.",
      },
      {
        heading: "6.4 — Security Measures",
        body: "All data in transit is encrypted using TLS 1.3. Data at rest is encrypted using AES-256. The platform undergoes mandatory annual security audits conducted by ANSI (Agence Nationale de la Sécurité des Systèmes d'Information). In the event of a data breach, affected users will be notified within 72 hours in accordance with Law 18-07.",
      },
      {
        heading: "6.5 — User Rights",
        body: "In accordance with Law 18-07, registered users hold the right to access, rectify, and object to the processing of their personal data. Requests must be submitted in writing to dpo@agrigov.dz with a copy of your national identity card. The Ministry will respond within 30 calendar days.",
      },
    ],
  },
  {
    id:       "conduct",
    icon:     "verified_user",
    title:    "Acceptable Use & Conduct",
    subtitle: "Utilisation acceptable et code de conduite",
    articles: [
      {
        heading: "7.1 — Prohibited Activities",
        body: "Users are strictly prohibited from: attempting to circumvent platform security mechanisms; scraping, crawling, or automated data extraction without written Ministry approval; impersonating other users, Ministry officials, or agents; posting false reviews or ratings; price collusion or market manipulation; and any activity constituting fraud, extortion, or abuse under Algerian criminal law.",
      },
      {
        heading: "7.2 — Communication Standards",
        body: "All in-platform communications must remain professional, respectful, and relevant to legitimate commercial activities. Harassment, discriminatory language, threats, or unsolicited commercial messages are strictly prohibited. The Ministry reserves the right to review flagged communications and take appropriate action, including account suspension.",
      },
      {
        heading: "7.3 — Reporting Violations",
        body: "Users who witness violations of these policies are encouraged to report them via the platform's built-in reporting tool or by emailing violations@agrigov.dz. Good-faith reporting is protected and will not result in adverse action against the reporting user. Anonymous reporting is available for sensitive matters.",
      },
      {
        heading: "7.4 — Consequences of Violations",
        body: "Violations of these policies may result in temporary suspension, permanent account termination, financial penalties, forfeiture of escrowed funds, and/or referral to Algerian judicial authorities, depending on the nature and severity of the infraction. The Ministry's disciplinary decisions are final, subject to appeal to the Administrative Court of Algiers.",
      },
    ],
  },
  {
    id:       "disputes",
    icon:     "balance",
    title:    "Dispute Resolution",
    subtitle: "Résolution des litiges",
    articles: [
      {
        heading: "8.1 — Internal Resolution Process",
        body: "All disputes must first be submitted through AGRIGOV's internal dispute resolution portal. Parties are required to attempt good-faith mediation facilitated by a platform mediator within 15 calendar days of dispute initiation. The mediator's recommendation is non-binding at this stage.",
      },
      {
        heading: "8.2 — Quality Commission",
        body: "Unresolved disputes relating to product quality, delivery confirmation, or payment are escalated to the AGRIGOV Quality Commission, composed of three MADR-appointed agricultural experts and one independent consumer representative. The Commission's ruling is binding and enforceable within 30 days of issuance.",
      },
      {
        heading: "8.3 — Judicial Recourse",
        body: "Disputes not resolved through internal processes may be referred to the competent courts of Algiers, which hold exclusive jurisdiction for all matters arising from AGRIGOV platform activity. Algerian law governs all aspects of these terms. The United Nations Convention on Contracts for the International Sale of Goods (CISG) is expressly excluded.",
      },
    ],
  },
  {
    id:       "liability",
    icon:     "shield",
    title:    "Liability & Indemnification",
    subtitle: "Responsabilité et indemnisation",
    articles: [
      {
        heading: "9.1 — Platform Liability Limitations",
        body: "AGRIGOV and the Ministry of Agriculture and Rural Development are not parties to transactions between users and accept no liability for: product quality beyond what is recoverable through the dispute process; losses arising from user error, credential compromise, or force majeure events; indirect, consequential, or incidental damages of any nature; or interruptions of service due to maintenance, cyberattacks, or infrastructure failures beyond reasonable control.",
      },
      {
        heading: "9.2 — User Indemnification",
        body: "Users agree to indemnify, defend, and hold harmless AGRIGOV, the Ministry, and their respective officers, agents, and employees from any claims, damages, losses, or expenses (including legal fees) arising from: your violation of these policies; your infringement of any third-party rights; any false or misleading information you submit to the platform; or your unlawful conduct in connection with platform activities.",
      },
      {
        heading: "9.3 — Force Majeure",
        body: "Neither party shall be liable for delays or failures in performance resulting from acts of God, natural disasters, government actions, pandemics, civil unrest, or other events beyond reasonable control, provided the affected party notifies the other within 72 hours of the event's occurrence and takes all reasonable steps to mitigate its effects.",
      },
    ],
  },
  {
    id:       "contact",
    icon:     "support_agent",
    title:    "Contact & Support",
    subtitle: "Contacts et assistance",
    articles: [
      {
        heading: "10.1 — General Support",
        body: "For general inquiries, technical support, and account assistance, contact the AGRIGOV support team at support@agrigov.dz or by telephone at +213 21 XX XX XX (Sunday–Thursday, 08:00–16:30 CET). Response time is within 2 business days for standard inquiries.",
      },
      {
        heading: "10.2 — Data Protection Officer",
        body: "For all matters relating to personal data, privacy, and data subject rights, contact the Data Protection Officer at dpo@agrigov.dz. Include your full name, national ID number, and a clear description of your request.",
      },
      {
        heading: "10.3 — Regulatory & Compliance",
        body: "For matters relating to pricing compliance, market regulation, and ministry oversight, contact the AGRIGOV Compliance Division at compliance@agrigov.dz or in writing to: Direction du Numérique Agricole, Ministère de l'Agriculture et du Développement Rural, 12 Boulevard Colonel Amirouche, Alger 16000, Algérie.",
      },
    ],
  },
];

// ─── Component: Table of Contents item ────────────────────────────────────────

function TocItem({ section, active, onClick }: {
  section: PolicySection;
  active:  boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
        active
          ? "bg-primary/10 dark:bg-primary/15 border border-primary/20"
          : "hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent"
      }`}
    >
      <span className={`material-icons text-base shrink-0 transition-colors ${
        active ? "text-primary" : "text-slate-400 group-hover:text-primary"
      }`}>
        {section.icon}
      </span>
      <span className={`text-sm font-medium leading-tight transition-colors ${
        active ? "text-primary-dark dark:text-primary" : "text-slate-600 dark:text-slate-400"
      }`}>
        {section.title}
      </span>
      {active && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
      )}
    </button>
  );
}

// ─── Component: Policy Section ────────────────────────────────────────────────

function Section({ section }: { section: PolicySection }) {
  return (
    <section id={section.id} className="scroll-mt-24">
      {/* Section header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/15 border border-primary/20 flex items-center justify-center">
          <span className="material-icons text-primary text-xl">{section.icon}</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {section.title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 italic">
            {section.subtitle}
          </p>
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-6">
        {section.articles.map((article) => (
          <div key={article.heading} className="pl-4 border-l-2 border-primary/20 hover:border-primary transition-colors group">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-primary-dark dark:group-hover:text-primary transition-colors">
              {article.heading}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {article.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PoliciesPage() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [tocOpen,       setTocOpen]       = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Highlight active ToC item on scroll
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the topmost visible section
          const topEntry = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveSection(topEntry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
      setTocOpen(false);
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-slate-900">
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Green glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-primary transition-colors">AGRIGOV</Link>
            <span className="material-icons text-xs opacity-50">chevron_right</span>
            <span className="text-primary">Politique & Conditions</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-bold text-primary tracking-widest uppercase">
                  Document Officiel du Ministère
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                Politique d&apos;Utilisation<br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-green-300">
                  de la Plateforme
                </span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                Conditions générales, règles d&apos;utilisation et politique de confidentialité
                de la Plateforme Nationale Agricole AGRIGOV.
              </p>
            </div>

            {/* Meta card */}
            <div className="shrink-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-3 min-w-55">
              {[
                { icon: "calendar_today", label: "Dernière mise à jour", value: LAST_UPDATED },
                { icon: "tag",            label: "Version",              value: VERSION       },
                { icon: "language",       label: "Juridiction",          value: "République Algérienne" },
                { icon: "verified",       label: "Statut",               value: "En vigueur"  },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="material-icons text-primary text-base shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider leading-none mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section count strip */}
          <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap gap-6">
            {[
              { value: String(SECTIONS.length),                         label: "Sections"        },
              { value: String(SECTIONS.reduce((a, s) => a + s.articles.length, 0)), label: "Articles" },
              { value: "10",                                            label: "Domaines couverts" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-black text-primary">{stat.value}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile ToC toggle ────────────────────────────────────────────────── */}
      <div className="lg:hidden sticky top-0 z-30 bg-background-light dark:bg-background-dark border-b border-neutral-light dark:border-border-dark px-4 py-3">
        <button
          onClick={() => setTocOpen((v) => !v)}
          className="flex items-center justify-between w-full text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          <span className="flex items-center gap-2">
            <span className="material-icons text-primary text-base">menu_book</span>
            Table des matières
          </span>
          <span className={`material-icons text-base transition-transform ${tocOpen ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </button>
        {tocOpen && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1">
            {SECTIONS.map((s) => (
              <TocItem
                key={s.id}
                section={s}
                active={activeSection === s.id}
                onClick={() => scrollTo(s.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Main layout ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex gap-10 items-start">

          {/* ── Sticky ToC (desktop) ────────────────────────────────────────── */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-8 self-start">
            <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-neutral-light dark:border-border-dark shadow-sm p-4">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-light dark:border-border-dark">
                <span className="material-icons text-primary text-base">menu_book</span>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Table des matières
                </p>
              </div>
              <nav className="space-y-0.5">
                {SECTIONS.map((s) => (
                  <TocItem
                    key={s.id}
                    section={s}
                    active={activeSection === s.id}
                    onClick={() => scrollTo(s.id)}
                  />
                ))}
              </nav>
            </div>

            {/* Download card */}
            <div className="mt-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <span className="material-icons text-primary mt-0.5">picture_as_pdf</span>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Version PDF officielle
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
                    Document certifié par le MADR, {VERSION}
                  </p>
                  <button className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                    <span className="material-icons text-sm">download</span>
                    Télécharger ({LAST_UPDATED})
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Policy content ──────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">

            {/* Important notice banner */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl px-5 py-4 flex items-start gap-3 mb-10">
              <span className="material-icons text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">warning</span>
              <div>
                <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">
                  Notice juridique importante
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  Ce document constitue un accord juridiquement contraignant entre vous et le Ministère de l&apos;Agriculture
                  et du Développement Rural de la République Algérienne Démocratique et Populaire.
                  En utilisant la plateforme AGRIGOV, vous confirmez avoir lu, compris et accepté l&apos;intégralité des
                  dispositions ci-dessous.
                </p>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-16">
              {SECTIONS.map((section, i) => (
                <div key={section.id}>
                  <Section section={section} />
                  {i < SECTIONS.length - 1 && (
                    <div className="mt-16 border-t border-neutral-light dark:border-border-dark" />
                  )}
                </div>
              ))}
            </div>

            {/* ── Footer acceptance block ────────────────────────────────── */}
            <div className="mt-16 bg-slate-900 dark:bg-slate-800 rounded-2xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
                  backgroundSize: "30px 30px",
                }} />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-5">
                  <span className="material-icons text-primary text-2xl">verified</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Politique en vigueur depuis le {LAST_UPDATED}
                </h3>
                <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">
                  Pour toute question relative à ces politiques, veuillez contacter notre
                  équipe d&apos;assistance ou consulter notre centre d&apos;aide.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/support"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-slate-900 font-bold text-sm rounded-lg hover:opacity-90 active:scale-95 transition-all"
                  >
                    <span className="material-icons text-base">support_agent</span>
                    Contacter le support
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-2.5 border border-white/20 text-white font-semibold text-sm rounded-lg hover:bg-white/5 transition-all"
                  >
                    <span className="material-icons text-base">arrow_back</span>
                    Retour à l&apos;accueil
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}