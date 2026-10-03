
import React from "react";
import {
  Mail,
  ShieldCheck,
  FileText,
  ReceiptText,
  ShieldAlert,
  ChevronRight,
  Instagram,
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

  const navigateTo = (page: string) => {
    handleNavigate(page);
  };

  const currentYear = new Date().getFullYear();

  const footerLinkClass = `
    group
    flex
    w-fit
    items-center
    gap-1.5
    text-sm
    text-gray-400
    transition-all
    duration-200
    hover:translate-x-0.5
    hover:text-white
    focus:outline-none
    focus-visible:ring-2
    focus-visible:ring-blue-400
    focus-visible:ring-offset-2
    focus-visible:ring-offset-[#080D1C]
  `;

  const policyLinkClass = `
    inline-flex
    items-center
    gap-1.5
    rounded-md
    text-xs
    text-gray-500
    transition-colors
    hover:text-gray-200
    focus:outline-none
    focus-visible:ring-2
    focus-visible:ring-blue-400
  `;

  return (
    <footer
      className="
        relative
        mt-16
        overflow-hidden
        border-t
        border-white/10
        bg-[#080D1C]
        text-white
      "
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
        aria-hidden="true"
      >
        <div
          className="
            absolute
            -top-32
            left-1/3
            h-96
            w-96
            rounded-full
            bg-blue-600/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            right-1/4
            h-80
            w-80
            rounded-full
            bg-indigo-600/10
            blur-3xl
          "
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 md:px-10">

        {/* =====================================================
            MAIN FOOTER CONTENT
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-10
            py-12
            sm:grid-cols-2
            lg:grid-cols-4
            lg:gap-12
          "
        >

          {/* =================================================
              BRAND SECTION
          ================================================== */}

          <div className="sm:col-span-2 lg:col-span-1">

            <button
              type="button"
              onClick={() => navigateTo("home")}
              aria-label="Go to Meet My Mate in home page"
              className="
                group
                text-left
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-400
                focus-visible:ring-offset-4
                focus-visible:ring-offset-[#080D1C]
              "
            >
              <div
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-white
                  transition-colors
                  group-hover:text-blue-100
                "
              >
                Meet My Mate in
              </div>

              <div className="mt-1 text-sm text-blue-400">
                Connect. Meet. Experience.
              </div>
            </button>

            <p
              className="
                mt-5
                max-w-sm
                text-sm
                leading-6
                text-gray-400
              "
            >
              A platform for meaningful real-world meeting
              experiences, personal connections, and professional
              meetups.
            </p>

            {/* SERVICE CLARITY */}

            <div
              className="
                mt-5
                flex
                items-start
                gap-2
                text-xs
                leading-5
                text-gray-400
              "
            >
              <ShieldCheck
                className="
                  mt-0.5
                  h-4
                  w-4
                  flex-shrink-0
                  text-blue-400
                "
                aria-hidden="true"
              />

              <span>
                Meeting arrangements follow the applicable
                service terms and policies.
              </span>
            </div>

            {/* FOUNDER */}

            <p className="mt-5 text-sm text-gray-400">
              Founded by:{" "}
              <span className="font-medium text-blue-400">
                Ayush Dutta
              </span>
            </p>

            {/* INSTAGRAM */}

            <div className="mt-5">
              <a
                href="https://www.instagram.com/meetmymatein.blindate?stkn=MWQzYnk4d21leGhpNg=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Meet My Mate in on Instagram"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-gray-400
                  transition-all
                  hover:border-pink-500/30
                  hover:bg-pink-500/10
                  hover:text-white
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-pink-400
                "
              >
                <Instagram
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                <span>@meetmymatein-blindate</span>
              </a>
            </div>
<div className="mt-5">
              <a
                href="https://www.instagram.com/meetmymatein.partnerup?stkn=MXBuMWwyb3VrMnJyZQ=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Meet My Mate in on Instagram"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-gray-400
                  transition-all
                  hover:border-pink-500/30
                  hover:bg-pink-500/10
                  hover:text-white
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-pink-400
                "
              >
                <Instagram
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                <span>@meetmymatein-partnerup</span>
              </a>
            </div>
          </div>

          {/* =================================================
              EXPLORE SECTION
          ================================================== */}

          <div>
            <h3
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-gray-300
              "
            >
              Explore
            </h3>

            <div className="mt-5 space-y-3">

              <button
                type="button"
                onClick={() => navigateTo("blind-date")}
                className={footerLinkClass}
              >
                <span>Blind Date</span>
                <ChevronRight
                  className="
                    h-3.5
                    w-3.5
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100
                  "
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={() => navigateTo("p2p-peer-listing")}
                className={footerLinkClass}
              >
                <span>PartnerUp</span>
                <ChevronRight
                  className="
                    h-3.5
                    w-3.5
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100
                  "
                  aria-hidden="true"
                />
              </button>

            </div>
          </div>

          {/* =================================================
              ACCOUNT SECTION
          ================================================== */}

          <div>
            <h3
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-gray-300
              "
            >
              Account
            </h3>

            <div className="mt-5 space-y-3">

              <button
                type="button"
                onClick={() => navigateTo("profile")}
                className={footerLinkClass}
              >
                <span>My Profile</span>
                <ChevronRight
                  className="
                    h-3.5
                    w-3.5
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100
                  "
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={() => navigateTo("bookings")}
                className={footerLinkClass}
              >
                <span>My Bookings</span>
                <ChevronRight
                  className="
                    h-3.5
                    w-3.5
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100
                  "
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={() => navigateTo("notifications")}
                className={footerLinkClass}
              >
                <span>Notifications</span>
                <ChevronRight
                  className="
                    h-3.5
                    w-3.5
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100
                  "
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={() => navigateTo("settings")}
                className={footerLinkClass}
              >
                <span>Settings</span>
                <ChevronRight
                  className="
                    h-3.5
                    w-3.5
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100
                  "
                  aria-hidden="true"
                />
              </button>

            </div>
          </div>

          {/* =================================================
              SUPPORT SECTION
          ================================================== */}

          <div>
            <h3
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-gray-300
              "
            >
              Support
            </h3>

            <div className="mt-5 space-y-3">

              <button
                type="button"
                onClick={() => navigateTo("help-center")}
                className={footerLinkClass}
              >
                <span>Help Center</span>
                <ChevronRight
                  className="
                    h-3.5
                    w-3.5
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100
                  "
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={() => navigateTo("contact")}
                className={footerLinkClass}
              >
                <span>Contact Us</span>
                <ChevronRight
                  className="
                    h-3.5
                    w-3.5
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100
                  "
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={() => navigateTo("faqs")}
                className={footerLinkClass}
              >
                <span>FAQs</span>
                <ChevronRight
                  className="
                    h-3.5
                    w-3.5
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100
                  "
                  aria-hidden="true"
                />
              </button>

              <a
                href="mailto:eng335527@gmail.com"
                className="
                  flex
                  items-start
                  gap-2
                  break-all
                  text-sm
                  text-gray-400
                  transition-colors
                  hover:text-white
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-blue-400
                "
              >
                <Mail
                  className="
                    mt-0.5
                    h-4
                    w-4
                    flex-shrink-0
                    text-blue-400
                  "
                  aria-hidden="true"
                />

                <span>eng335527@gmail.com</span>
              </a>

            </div>
          </div>

        </div>

        {/* =====================================================
            LEGAL & POLICY SECTION
        ====================================================== */}

        <div className="border-t border-white/10" />

        <div className="py-7">

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* LEGAL LINKS */}

            <div>
              <h3
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-gray-300
                "
              >
                Legal & Policies
              </h3>

              <div
                className="
                  mt-4
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                "
              >

                <button
                  type="button"
                  onClick={() => navigateTo("privacy-policy")}
                  className={policyLinkClass}
                >
                  <ShieldCheck
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  Privacy Policy
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo("terms")}
                  className={policyLinkClass}
                >
                  <FileText
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  Terms of Service
                </button>

               

               

                

              </div>
            </div>

            {/* SERVICE INFORMATION */}

            <div className="md:text-right">

              <h3
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-gray-300
                "
              >
                Service Information
              </h3>

              <p
                className="
                  mt-4
                  text-xs
                  leading-5
                  text-gray-500
                  md:ml-auto
                  md:max-w-sm
                "
              >
                Prices, eligibility requirements, meeting
                arrangements, and refund conditions are
                explained in the applicable service terms.
              </p>

              <p
                className="
                  mt-3
                  text-xs
                  leading-5
                  text-gray-500
                  md:ml-auto
                  md:max-w-sm
                "
              >
                Personal expenses incurred during meetings
                are not included unless explicitly stated.
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            COPYRIGHT ROW
        ====================================================== */}

        <div className="border-t border-white/10" />

        <div
          className="
            flex
            flex-col
            gap-3
            py-5
            text-xs
            text-gray-500
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>
            © {currentYear} Meet My Mate in. All rights reserved.
          </p>

          <p>
            Built for real-world connections.
          </p>
        </div>

      </div>

      {/* =====================================================
          BOTTOM ACCENT
      ====================================================== */}

      <div
        className="
          h-px
          bg-gradient-to-r
          from-transparent
          via-blue-500/40
          to-transparent
        "
        aria-hidden="true"
      />

    </footer>
  );
}

export default Footer;