import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

export default function Breadcrumb({ crumbs }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="flex mb-8">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <span className="material-icons text-sm">home</span>
          </Link>
        </li>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.label} className="flex items-center space-x-2">
              <span className="text-gray-300 dark:text-gray-600">/</span>
              {isLast ? (
                <span
                  aria-current="page"
                  className="text-primary-dark dark:text-primary text-sm font-medium"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href ?? "#"}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}