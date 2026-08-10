import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import { VerifyTransaction } from "@/components/verify-transaction";

const title = "Verify Transaction - RoEscrow";
const description = "Verify your RoEscrow transaction by reference ID.";

export const Route = createFileRoute("/verify/$referenceId")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: VerifyReferencePage,
});

function VerifyReferencePage() {
  const { referenceId } = Route.useParams();

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <NavBar />
      <main>
        <VerifyTransaction initialReferenceId={referenceId} autoVerify />
      </main>
      <Footer />
    </div>
  );
}
