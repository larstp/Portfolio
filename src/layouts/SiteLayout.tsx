import { Analytics } from "@vercel/analytics/react";
import type { ReactNode } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollIndicator from "../components/ScrollIndicator";

type SiteLayoutProps = {
  children: ReactNode;
};

function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <Header />
      <ScrollIndicator />
      {children}
      <Footer />
      <Analytics />
    </>
  );
}

export default SiteLayout;
