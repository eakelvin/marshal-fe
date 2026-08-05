import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserAccountMenu } from "@/components/shared/user-account-menu";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/api/user-server";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <div className="relative min-h-dvh flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 lg:px-6">
          <Logo />
          <nav
            aria-label="Marketing"
            className="hidden items-center gap-6 text-sm text-muted-foreground md:flex"
          >
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#agents" className="hover:text-foreground transition-colors">
              Agents
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <UserAccountMenu user={user} />
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex"
                  render={<Link href="/login" />}
                >
                  Sign in
                </Button>
                <Button size="sm" render={<Link href="/register" />}>
                  Get started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
