import logoIcon from '@/assets/logo-icon.png';
import logo from '@/assets/logo-dark.png';
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
} from 'lucide-react';
import { breadcrumbStore } from '@/store/globalStore';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Fragment } from 'react';

const Footer = () => {
  const breadcrumbs = breadcrumbStore((state) => state.breadcrumbs);
  const breadcrumbLen = breadcrumbs.length;

  return (
    <footer className="bg-foreground text-background shadow-inner">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="text-sm text-white hover:text-white hover:underline"
                    href={crumb.path}
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < breadcrumbLen - 1 && (
                  <BreadcrumbSeparator className="text-white" />
                )}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="xl:grid-col-5 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mr-8 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Sticker Studio Logo" className="h-16" />
            </div>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                aria-label="Follow us on Facebook"
                className="transition hover:opacity-70"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                aria-label="Follow us on Instagram"
                className="transition hover:opacity-70"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                aria-label="Follow us on LinkedIn"
                className="transition hover:opacity-70"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="text-xs">
                <a href="#" className="opacity-80 transition hover:opacity-100">
                  Account
                </a>
              </li>
              <li className="text-xs">
                <a href="#" className="opacity-80 transition hover:opacity-100">
                  Profile
                </a>
              </li>
              <li className="text-xs">
                <a href="#" className="opacity-80 transition hover:opacity-100">
                  Orders
                </a>
              </li>
              <li className="text-xs">
                <a href="#" className="opacity-80 transition hover:opacity-100">
                  Wishlist
                </a>
              </li>
              <li className="text-xs">
                <a href="#" className="opacity-80 transition hover:opacity-100">
                  Logout
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Support / Help</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="text-xs">
                <a href="#" className="opacity-80 transition hover:opacity-100">
                  FAQ
                </a>
              </li>
              <li className="text-xs">
                <a href="#" className="opacity-80 transition hover:opacity-100">
                  Contact
                </a>
              </li>
              <li className="text-xs">
                <a href="#" className="opacity-80 transition hover:opacity-100">
                  Refund / Return Policy
                </a>
              </li>
              <li className="text-xs">
                <a href="#" className="opacity-80 transition hover:opacity-100">
                  Shipping & Delivery
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Company</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="text-xs">
                <a href="#" className="opacity-80 transition hover:opacity-100">
                  About Us
                </a>
              </li>
              <li className="text-xs">
                <a href="#" className="opacity-80 transition hover:opacity-100">
                  Privacy Policy
                </a>
              </li>
              <li className="text-xs">
                <a href="#" className="opacity-80 transition hover:opacity-100">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Contact Info</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="text-sx fletext-xs">
                <Phone size={16} className="mt-0.5 shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="opacity-80 transition hover:opacity-100"
                >
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex gap-3 text-xs">
                <Mail size={16} className="mt-0.5 shrink-0" />
                <a
                  href="mailto:support@stickerstudio.com"
                  className="opacity-80 transition hover:opacity-100"
                >
                  support@stickerstudio@gmail.com
                </a>
              </li>
              <li className="flex gap-3 text-xs">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span className="opacity-80">Address</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-background/10 mt-8 border-t pt-8 text-center text-xs opacity-60">
          <p>
            &copy; {new Date().getFullYear()} Sticker Studio. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
