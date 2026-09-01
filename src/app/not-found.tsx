import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-light tracking-tight text-text-primary mb-2">
          404
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          Page not found
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-10 px-5 text-sm font-medium bg-text-primary text-bg-primary rounded-pill hover:bg-text-secondary transition-colors duration-200"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
