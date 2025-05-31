import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AppSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header/>
      <main className="pt-16 sm:pt-36 pb-4 sm:pb-16">{children}</main>
      <Footer/>
    </div>
  );
}