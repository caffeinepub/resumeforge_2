import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-[#0B1220] text-gray-400 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🚀</span>
              <span className="font-bold text-white bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                ResumeForge
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Build professional resumes that stand out and land your dream job.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/builder"
                  className="hover:text-white transition-colors"
                >
                  Builder
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  About
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Blog
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Careers
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Privacy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Terms
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © 2026 ResumeForge. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-500">
            <span className="hover:text-white cursor-pointer transition-colors text-lg">
              𝕏
            </span>
            <span className="hover:text-white cursor-pointer transition-colors text-lg">
              in
            </span>
            <span className="hover:text-white cursor-pointer transition-colors text-lg">
              ⚡
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
