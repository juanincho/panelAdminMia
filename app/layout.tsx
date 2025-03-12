"use client";

import "./globals.css";
import { AuthProvider } from "./auth/AuthContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Factory,
  ChevronDown,
  Menu,
  LayoutDashboard,
  FileText,
  BookOpen,
  Users,
  Building2,
  CreditCard,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Solicitudes",
    href: "/dashboard/solicitudes",
    icon: FileText,
  },
  {
    title: "Reservas",
    href: "/dashboard/reservas",
    icon: BookOpen,
  },
  {
    title: "Clientes",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "Hoteles",
    href: "/dashboard/hotels",
    icon: Building2,
  },
  {
    title: "Pagos",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Facturas",
    href: "/dashboard/invoices",
    icon: Receipt,
  },
  {
    title: "Empresas",
    href: "/dashboard/empresas",
    icon: Factory,
  },
  {
    title: "Viajeros",
    href: "/dashboard/viajeros",
    icon: Users,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex w-64 flex-col border-r bg-gray-100/40 dark:bg-gray-800/40">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Admin Panel</h2>
            </div>
            <ScrollArea className="flex-1 px-3">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link key={item.title} href={item.href}>
                    <span
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href ? "bg-accent" : "transparent"
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </span>
                  </Link>
                ))}
              </nav>
            </ScrollArea>
          </aside>
          {/* Mobile Sidebar */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="lg:hidden fixed left-4 top-4 z-40"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6">
                <h2 className="text-lg font-semibold">Admin Panel</h2>
              </div>
              <ScrollArea className="h-[calc(100vh-5rem)]">
                <nav className="flex flex-col gap-2 px-3">
                  {navItems.map((item) => (
                    <Link key={item.title} href={item.href}>
                      <span
                        className={cn(
                          "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          pathname === item.href ? "bg-accent" : "transparent"
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </span>
                    </Link>
                  ))}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <AuthProvider>{children}</AuthProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
