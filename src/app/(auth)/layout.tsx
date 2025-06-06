interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = async ({children}: AuthLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="grow bg-neutral-200 px-3 flex flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;