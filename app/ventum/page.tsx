import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar/navbar";
import FeaturesGrid from "@/app/components/features/features-grid";
import { getCurrentUser } from "@/lib/auth";

export default async function VenTumHomePage() {
  const user = await getCurrentUser();
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar user={user} />
      <main className="flex-grow">
        <FeaturesGrid />
      </main>
      <Footer />
    </div>
  );
}
