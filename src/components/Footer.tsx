import React from "react";
import {

  Mail,
  ShieldCheck,
} from "lucide-react";

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer className="relative mt-16 overflow-hidden bg-[#080D1C] text-white border-t border-white/10">

      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/3 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">

        {/* MAIN FOOTER */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* BRAND */}
          <div className="lg:col-span-1">

            <button
              type="button"
              onClick={() => handleNavigate("home")}
              className="group text-left"
            >
              <div className="text-2xl font-bold tracking-tight text-white">
                Meet My Mate in
              </div>

              <div className="mt-1 text-sm text-blue-400">
                Connect. Meet. Experience.
              </div>
            </button>

            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-400">
              A platform for meaningful real-world connections,
              experiences and professional meetups.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Built for real-world connections</span>
            </div>

            {/* SOCIAL */}
            <div className="flex items-center gap-2 mt-6">

             <p className="text-sm text-gray-400">
                Founded by : <span className="text-blue-400">Ayush Dutta</span>
              </p>

              <a
  href="https://www.instagram.com/meetmymate.in/?__pwa=1#"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Instagram"
  className="
    inline-flex items-center gap-2
    px-3 h-9
    rounded-lg
    border border-white/10
    bg-white/[0.03]
    text-gray-400
    hover:text-white
    hover:bg-pink-500/10
    hover:border-pink-500/30
    transition-all
  "
>
 

  <span className="text-xs font-medium">
    @meetmymate.in
  </span>
</a>
             
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-300">
              Explore
            </h3>

            <div className="mt-5 space-y-3">

            

              <button
                onClick={() => handleNavigate("blind-date")}
                className="block text-sm text-gray-400 hover:text-white hover:translate-x-0.5 transition-all"
              >
                Blind Date
              </button>

             

              <button
                onClick={() => handleNavigate("p2p-peer-listing")}
                className="block text-sm text-gray-400 hover:text-white hover:translate-x-0.5 transition-all"
              >
               PartnerUp
              </button>

            </div>
          </div>

          {/* ACCOUNT */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-300">
              Account
            </h3>

            <div className="mt-5 space-y-3">

              <button
                onClick={() => handleNavigate("profile")}
                className="block text-sm text-gray-400 hover:text-white hover:translate-x-0.5 transition-all"
              >
                My Profile
              </button>

              <button
                onClick={() => handleNavigate("bookings")}
                className="block text-sm text-gray-400 hover:text-white hover:translate-x-0.5 transition-all"
              >
                My Bookings
              </button>

              <button
                onClick={() => handleNavigate("notifications")}
                className="block text-sm text-gray-400 hover:text-white hover:translate-x-0.5 transition-all"
              >
                Notifications
              </button>

              <button
                onClick={() => handleNavigate("settings")}
                className="block text-sm text-gray-400 hover:text-white hover:translate-x-0.5 transition-all"
              >
                Settings
              </button>

            </div>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-300">
              Support
            </h3>

            <div className="mt-5 space-y-3">

              <button
                type="button"
                className="block text-sm text-gray-400 hover:text-white transition-all"
              >
                Help Center
              </button>

              <button
                type="button"
                className="block text-sm text-gray-400 hover:text-white transition-all"
              >
                Contact Us
              </button>

              <button
                type="button"
                className="block text-sm text-gray-400 hover:text-white transition-all"
              >
                FAQs
              </button>

              <a
                href="mailto:eng335527@gmail.com"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-all"
              >
                <Mail className="w-4 h-4 text-blue-400" />
               eng335527@gmail.com
              </a>

            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10" />

        {/* POLICY ROW */}
        <div className="py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">

            <button className="text-xs text-gray-500 hover:text-gray-300 transition">
              Privacy Policy
            </button>

            <button className="text-xs text-gray-500 hover:text-gray-300 transition">
              Terms & Conditions
            </button>

            <button className="text-xs text-gray-500 hover:text-gray-300 transition">
              Refund Policy
            </button>

            <button className="text-xs text-gray-500 hover:text-gray-300 transition">
              Cancellation Policy
            </button>

            <button className="text-xs text-gray-500 hover:text-gray-300 transition">
              Safety
            </button>

          </div>

          <div className="text-xs text-gray-500">
            © {new Date().getFullYear()} Meet My Mate in
          </div>

        </div>

      </div>

      {/* BOTTOM ACCENT */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

    </footer>
  );
}

export default Footer;