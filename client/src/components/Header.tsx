import { Link } from "wouter";
import { BrainCircuit } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <BrainCircuit className="text-primary text-3xl mr-2 h-8 w-8" />
                <h1 className="text-2xl font-bold text-neutral-700">Brain Tumor Detector</h1>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link href="/">
                <span className="text-neutral-600 hover:text-primary cursor-pointer">Home</span>
              </Link>
              <Link href="/dataset">
                <span className="text-neutral-600 hover:text-primary cursor-pointer">Dataset</span>
              </Link>
              <Link href="/about">
                <span className="text-neutral-600 hover:text-primary cursor-pointer">About</span>
              </Link>
            </nav>
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-white">
                <span className="material-icons text-sm mr-1">verified</span>
                Medical Version
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
