import {Footer} from "@/app/(home)/_components/footer";
import {Navbar} from "@/app/(home)/_components/navbar";

interface HomeLayoutProps {
  children: React.ReactNode
}

const HomeLayout = ({children}: HomeLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow bg-neutral-200 px-3">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;