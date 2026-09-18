/** @format */
import facebook from "../../images/facebook.png";
import instagram from "../../images/instagram.png";
import { X } from "lucide-react";
import { Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer-background text-white mt-3">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-300">
          <a
            href="/terms"
            className="relative transition-all duration-200 hover:-translate-y-0.5 hover:text-sky-500 text-gray-700">
            Terms and Conditions
          </a>
          <span className="w-px h-4 bg-gray-600 hidden sm:block" />
          <a
            href="/privacy"
            className="relative transition-all duration-200 hover:-translate-y-0.5 hover:text-sky-500 text-gray-700">
            Privacy Policy
          </a>
          <span className="w-px h-4 bg-gray-600 hidden sm:block" />
          <a
            href="/contact"
            className="relative transition-all duration-200 hover:-translate-y-0.5 hover:text-sky-500 text-gray-700">
            Contact us
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <a
            href="https://www.whatsapp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-sky-500 hover:-translate-y-0.5 transition-all duration-200">
            <Phone size={23} />
          </a>
          <span className="w-px h-6 bg-gray-600 hidden sm:block" />
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200">
              <img width="23" height="23" src={facebook} alt="facebook" />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200">
              <img width="23" height="23" src={instagram} alt="instagram" />
            </a>
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400  hover:-translate-y-0.5 transition-all duration-200">
              <X size={23} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
