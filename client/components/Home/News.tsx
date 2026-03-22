import Image from "next/image";
import Link from "next/link";
import type { NewsArticle } from "@/types/Home";

interface Props {
  articles: NewsArticle[];
}

export default function NewsSection({ articles }: Props) {
  const featured = articles.find((a) => a.featured)!;
  const secondary = articles.filter((a) => !a.featured);

  return (
    <section className="py-20 bg-surface-light dark:bg-surface-dark/50 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Ministry News &amp; Resources
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Featured */}
          <div className="md:col-span-2 relative group rounded-xl overflow-hidden h-80 lg:h-auto shadow-md">
            {featured.imageUrl && (
              <Image
                src={featured.imageUrl}
                alt={featured.imageAlt ?? featured.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <span className="inline-block px-3 py-1 bg-primary text-black text-xs font-bold rounded-full mb-3">
                {featured.category}
              </span>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                {featured.title}
              </h3>
              <p className="text-slate-300 text-sm line-clamp-2 mb-4">{featured.excerpt}</p>
              <Link
                href={featured.href}
                className="inline-flex items-center text-sm font-semibold text-white hover:underline"
              >
                {featured.ctaLabel}
                <span className="material-icons text-sm ml-1">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Secondary articles */}
          {secondary.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-primary/50 transition-colors flex flex-col h-full"
            >
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                {article.date} • {article.category}
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                {article.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 grow">
                {article.excerpt}
              </p>
              <Link
                href={article.href}
                className="text-primary text-sm font-semibold hover:underline mt-auto"
              >
                {article.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}