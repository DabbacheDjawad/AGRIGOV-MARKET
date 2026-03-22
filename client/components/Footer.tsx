import Link from "next/link";

const footerLinks = [
  { label: "Buyer Protection", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Help Center", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-green-900/30 mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="material-icons text-primary">agriculture</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} National Ministry of Agriculture. All rights reserved.
          </span>
        </div>
        <nav className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
          {footerLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}