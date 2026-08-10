import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <NavBar />
      <main className="pt-10">{children}</main>
      <Footer />
    </div>
  );
}
