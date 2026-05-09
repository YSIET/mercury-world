import Footer from "@/components/Footer";
import MobileBackButton from "@/components/MobileBackButton";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mw-admin-layout-shell">
      <div className="mw-mobile-back-slot">
        <MobileBackButton />
      </div>
      {children}
      <Footer />
    </div>
  );
}
