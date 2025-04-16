"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Receipt, CalendarDays, Users } from "lucide-react";

const sidebarNavItems = [
  {
    title: "Facturas",
    href: "/invoices",
    icon: Receipt,
  },
  {
    title: "Reservaciones",
    href: "/reservations",
    icon: CalendarDays,
  },
  {
    title: "Usuarios",
    href: "/users",
    icon: Users,
  },
];

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  console.log(pathname);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-fit">
      {/* Sidebar */}
      <div
        className={cn(
          "relative h-fit border-r bg-white transition-all duration-300",
          isOpen ? "w-64" : "w-16"
        )}
      >
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-4 z-40 h-8 w-8 rounded-full border bg-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("transition-transform", isOpen ? "rotate-180" : "")}
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Button>

        {/* Sidebar Content */}
        <ScrollArea className="h-full py-6">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <div className="space-y-1">
                <h2
                  className={cn(
                    "mb-4 px-2 text-xl font-semibold tracking-tight transition-all",
                    !isOpen && "text-center text-sm"
                  )}
                >
                  {isOpen ? "Panel de Cliente" : "PC"}
                </h2>
                <nav className="space-y-2">
                  {sidebarNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={`/${pathname
                        .split("/")
                        .filter((str) => str)
                        .slice(0, 3)
                        .join("/")}${item.href}`}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-blue-50 hover:text-blue-900",
                        pathname === item.href
                          ? "bg-blue-100 text-blue-900"
                          : "text-gray-500",
                        !isOpen && "justify-center"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {isOpen && <span>{item.title}</span>}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Suspense
          fallback={
            <>
              <h1>Cargando tu contenido...</h1>
            </>
          }
        >
          {children}
        </Suspense>
      </div>
    </div>
  );
}
