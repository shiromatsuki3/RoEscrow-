import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/nav-bar";
import { Hero } from "@/components/hero";
import { Stats } from "@/components/stats";
import { HowItWorks } from "@/components/how-it-works";
import { Services } from "@/components/services";
import { WhyRoEscrow } from "@/components/why-roescrow";
import { Fees } from "@/components/fees";
import { Safety } from "@/components/safety";
import { TransactionForm } from "@/components/transaction-form";
import { Reviews } from "@/components/reviews";
import { Faq } from "@/components/faq";
import { Cta } from "@/components/cta";
import { Footer } from "@/components/footer";

const title = "RoEscrow™ | Secure Roblox Middleman & Escrow Services";
const description =
  "RoEscrow provides secure middleman services for Roblox transactions, helping buyers and sellers complete deals with confidence.";

export const Route = createFileRoute("/")({
  head: () => ({
   meta: [
  { title },
  { name: "description", content: description },

  { property: "og:site_name", content: "RoEscrow™" },
  { property: "og:title", content: title },
  { property: "og:description", content: description },
  { property: "og:type", content: "website" },
  {
    property: "og:url",
    content: "https://ro-escrow.vercel.app/",
  },
  {
    property: "og:image",
    content: "https://ro-escrow.vercel.app/escrow-banner.png",
  },
  {
    property: "og:image:width",
    content: "1200",
  },
  {
    property: "og:image:height",
    content: "630",
  },
  {
    property: "og:image:alt",
    content: "RoEscrow™ — Secure Roblox Middleman & Escrow",
  },
],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <NavBar />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <Services />
        <WhyRoEscrow />
        <Fees />
        <Safety />
        <TransactionForm />
        <Reviews />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
