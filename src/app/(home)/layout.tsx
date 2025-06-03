import {Footer} from "./_components/footer";
import {Navbar} from "./_components/navbar";

interface HomeLayoutProps {
  children: React.ReactNode
}

const HomeLayout = ({children}: HomeLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow bg-neutral-200 px-3 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;