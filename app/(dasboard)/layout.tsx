import Header from "@/components/header";

export default function AppSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header/>
      <main className="pt-28 sm:pt-36">{children}</main>
    </div>
  );
}