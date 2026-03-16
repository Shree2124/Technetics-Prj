import Link from "next/link";
import { Facebook, Twitter, Youtube, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 border-b border-gray-200 pb-12">
          <div>
            <h3 className="mb-4 text-base font-bold text-gov-dark-blue">About the Portal</h3>
            <p className="text-sm text-gov-slate leading-relaxed">
              The National Citizen Welfare Portal is a centralized platform developed to provide single-window access to all government schemes and benefits.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-base font-bold text-gov-dark-blue">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gov-slate">
              <li><Link href="#" className="hover:text-gov-mid-blue">Home</Link></li>
              <li><Link href="#" className="hover:text-gov-mid-blue">About Us</Link></li>
              <li><Link href="#" className="hover:text-gov-mid-blue">Schemes Directory</Link></li>
              <li><Link href="#" className="hover:text-gov-mid-blue">Help & Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-base font-bold text-gov-dark-blue">Important Links</h3>
            <ul className="space-y-2 text-sm text-gov-slate">
              <li><Link href="#" className="hover:text-gov-mid-blue">National Portal of India</Link></li>
              <li><Link href="#" className="hover:text-gov-mid-blue">MyGov</Link></li>
              <li><Link href="#" className="hover:text-gov-mid-blue">Digital India</Link></li>
              <li><Link href="#" className="hover:text-gov-mid-blue">Data Security Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-bold text-gov-dark-blue">Connect With Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gov-slate hover:text-gov-mid-blue">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gov-slate hover:text-gov-mid-blue">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gov-slate hover:text-gov-mid-blue">
                <span className="sr-only">YouTube</span>
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gov-slate hover:text-gov-mid-blue">
                <span className="sr-only">Email support</span>
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-4 text-sm text-gov-slate">
              Toll Free: 1800-XXX-XXXX
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-between py-6 text-xs text-gov-slate sm:flex-row">
          <p>
            © {new Date().getFullYear()} Government of India. All rights reserved.
          </p>
          <div className="mt-4 flex gap-4 sm:mt-0">
            <Link href="#" className="hover:text-gov-dark-blue">Privacy Policy</Link>
            <Link href="#" className="hover:text-gov-dark-blue">Terms of Use</Link>
            <Link href="#" className="hover:text-gov-dark-blue">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
