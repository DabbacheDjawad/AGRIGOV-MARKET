"use client"; 

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { adminNavItems } from "@/types/Ministry";

export default function AdminSidebar() {
  const pathname = usePathname(); 
  const renderedSections = new Set<string>();
  const items = adminNavItems;

  return (
    <aside className="fixed bottom-0 left-0 w-full h-16 bg-secondary-dark dark:bg-black text-white flex flex-row border-t border-slate-700 z-50 lg:fixed lg:top-0 lg:w-64 lg:h-screen lg:flex-col lg:border-t-0 lg:border-r lg:shadow-xl shrink-0">
      
      <div className="hidden lg:flex p-6 items-center space-x-3 border-b border-slate-700">
        <div className="bg-primary/20 p-2 rounded-lg">
          <span className="material-icons text-primary">agriculture</span>
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">AgriMinistry</h1>
          <p className="text-xs text-slate-400">National Platform</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-row justify-around items-center px-2 lg:flex-col lg:justify-start lg:py-6 lg:px-3 lg:space-y-1 overflow-y-auto">
        {items.map((item) => {
          const showSection = item.section && !renderedSections.has(item.section);
          if (item.section) renderedSections.add(item.section);
          const isActive = pathname === item.href;

          return (
            <div key={item.label} className="flex-1 lg:flex-none lg:w-full">
              {showSection && (
                <div className="hidden lg:block pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {item.section}
                </div>
              )}
              
              <Link
                href={item.href}
                className={`flex flex-col lg:flex-row items-center justify-center lg:justify-start lg:space-x-3 lg:px-4 lg:py-3 rounded-lg transition-colors font-medium py-1 ${
                  isActive
                    ? "text-primary lg:bg-primary/20" 
                    : "text-slate-400 hover:text-white lg:hover:bg-slate-800" 
                }`}
              >
                <span className="material-icons text-xl lg:text-base">{item.icon}</span>
                <span className="text-[10px] lg:text-sm max-lg:text-center">{item.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="hidden lg:block p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDySDX0-R8DW4b0KFaJG8HO66QiDQCebdLeCvJcHiVNosUzVYOa8GO-e_PRB4F-f8YNliMOGpfymU48LwOfD9on6NIuEoGn_T6OLKmSy_FHQa4E1PKgaFxr0IUENehF1ArNg88GeHBRx7r9lm91k-dm-hRgKm5qxfEOMbRsTqqcHezl9PWxvxGfHEwdAzWUUd781RD9GlltwgP5zPUc4FZAemaKa0U3WICuhqhkMlX8Jf8RGE0Ghg3Bmx91UFOnMx6idib-Gthio1En"
              alt="Admin"
              fill
              className="rounded-full object-cover"
              sizes="40px"
            />
          </div>
          <div>
            <p className="text-sm font-medium">Ministry Account</p>
            <p className="text-xs text-slate-400">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}