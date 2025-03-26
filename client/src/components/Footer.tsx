import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white mt-12">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link href="/about">
              <a className="text-neutral-500 hover:text-neutral-700">
                About
              </a>
            </Link>
            <Link href="/privacy">
              <a className="text-neutral-500 hover:text-neutral-700">
                Privacy
              </a>
            </Link>
            <Link href="/terms">
              <a className="text-neutral-500 hover:text-neutral-700">
                Terms
              </a>
            </Link>
            <Link href="/contact">
              <a className="text-neutral-500 hover:text-neutral-700">
                Contact
              </a>
            </Link>
          </div>
          <p className="mt-4 text-center md:mt-0 md:text-right text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} Brain Tumor Detection System
          </p>
        </div>
      </div>
    </footer>
  );
}
