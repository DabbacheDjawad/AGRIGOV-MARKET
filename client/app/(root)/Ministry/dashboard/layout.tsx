import AdminSidebar from "@/components/Ministry/AdminSideBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen lg:flex-row  bg-background-light dark:bg-background-dark">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header: Adjusted fixed position logic */}
        <header className="fixed top-0 right-0 left-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 h-16 shadow-sm border-b border-primary/10 lg:left-64">
          <span className="text-xl font-extrabold text-primary italic">Harvest Intel</span>
        </header>
        <main className="flex-1 pt-20 pb-24 md:pb-12 ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}