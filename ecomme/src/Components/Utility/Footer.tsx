/** @format */
import facebook from "../../images/facebook.png";
import instagram from "../../images/instagram.png";
import twitter from "../../images/twitter.png";
import phone from "../../images/phone.png";

const Footer = () => {
  return (
    <footer className="footer-background bg-[#12141c] text-white mt-3">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300">
          <a
            href="#"
            className="hover:text-white transition-colors duration-200">
            Terms and Conditions
          </a>
          <span className="w-px h-4 bg-gray-600" />
          <a
            href="#"
            className="hover:text-white transition-colors duration-200">
            Privacy Policy
          </a>
          <span className="w-px h-4 bg-gray-600" />
          <a
            href="#"
            className="hover:text-white transition-colors duration-200">
            Contact us
          </a>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img width="24" height="24" src={phone} alt="phone" />
            <p className="font-bold tracking-wide">0122455346356</p>
          </div>
          <span className="w-px h-6 bg-gray-600 hidden sm:block" />
          <div className="flex items-center gap-4">
            <a
              href="www.facebook.com"
              className="opacity-80 hover:opacity-100 transition-opacity duration-200">
              <img width="22" height="22" src={facebook} alt="facebook" />
            </a>
            <a
              href="#"
              className="opacity-80 hover:opacity-100 transition-opacity duration-200">
              <img width="22" height="22" src={instagram} alt="instagram" />
            </a>
            <a
              href="#"
              className="opacity-80 hover:opacity-100 transition-opacity duration-200">
              <img width="22" height="22" src={twitter} alt="twitter" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
