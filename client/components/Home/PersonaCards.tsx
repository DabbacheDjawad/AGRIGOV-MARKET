import Link from "next/link";

interface QuickLink {
  icon: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  color: string;   // Tailwind classes for icon background + text
}

interface Props {
  links: QuickLink[];
}

export default function PersonaCards({ links }: Props) {
  if (!links.length) return null;   // fallback if no role recognised

  return (
    <div className="relative z-20 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {links.map((link) => (
          <div
            key={link.href}
            className="group bg-surface-light dark:bg-surface-dark p-8 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all hover:-translate-y-1"
          >
            <div className={`h-14 w-14 rounded-lg flex items-center justify-center mb-6 ${link.color}`}>
              <span className="material-icons text-3xl">{link.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {link.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
              {link.description}
            </p>
            <Link
              href={link.href}
              className="inline-flex items-center text-sm font-bold text-primary hover:underline"
            >
              {link.cta}
              <span className="material-icons text-sm ml-1">arrow_forward</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}