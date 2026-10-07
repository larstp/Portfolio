import { Analytics } from "@vercel/analytics/react";
import type { ReactNode } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";

type SiteLayoutProps = {
  children: ReactNode;
};

function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <Header />
      <ScrollToTop />
      {children}
      <Footer />
      <Analytics />
    </>
  );
}

export default SiteLayout;
