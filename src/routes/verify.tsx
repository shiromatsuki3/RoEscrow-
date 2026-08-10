import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/nav-bar";
import { VerifyTransaction } from "@/components/verify-transaction";
import { Footer } from "@/components/footer";

const title = "Verify Transaction — RoEscrow™";
const description =
  "Verify your RoEscrow transaction by entering your reference ID to view transaction details and status.";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <NavBar />
      <main>
        <VerifyTransaction />
      </main>
      <Footer />
    </div>
  );
}
