"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { firebaseClientAuth } from "@/lib/firebase/client";

const navigation = [
  { label: "Dashboard", href: "/admin" },
  { label: "Specialties", href: "/admin/specialties" },
  { label: "Questions", href: "/admin/questions" },
  { label: "Traits", href: "/admin/traits" },
  { label: "Specialty Profiles", href: "/admin/specialty-profiles" },
  { label: "Resident Interviews", href: "/admin/resident-interviews" },
  { label: "FAQ", href: "/admin/faq" },
  { label: "Settings", href: "/admin/settings" },
  { label: "Analytics", href: "/admin/analytics" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseClientAuth, async (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (pathname === "/admin/login") {
      if (user) {
        router.replace("/admin");
      }
      return;
    }

    if (user === null) {
      router.replace("/admin/login");
    }
  }, [pathname, router, user]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (user === undefined) {
    return null;
  }

  if (user === null) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-border bg-black/2 px-6 py-8 lg:border-b-0 lg:border-r lg:px-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              Admin
            </p>
            <h1 className="text-2xl font-semibold tracking-[-0.03em]">
              Residency workspace
            </h1>
            <p className="text-sm leading-6 text-muted">
              Editorial content, question banks, interview research, and scoring
              data.
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-muted transition-colors hover:border-border hover:bg-white/70 hover:text-foreground">
                <span>{item.label}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="border-b border-border px-6 py-5 sm:px-8 lg:px-10">
            <p className="text-sm text-muted">
              Firestore-backed admin shell with a service-first repository
              pattern.
            </p>
          </header>

          <main className="flex-1 px-6 py-6 sm:px-8 lg:px-10 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
