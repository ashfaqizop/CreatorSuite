"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Panel, SectionTitle } from "@/components/ui/ResultCard";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col gap-6 max-w-[600px]">
      <h1 className="font-display text-cs-32">Settings</h1>

      <Panel>
        <SectionTitle>Account</SectionTitle>
        {status === "loading" ? (
          <p className="font-mono text-cs-fg-muted">Loading…</p>
        ) : session?.user ? (
          <div className="flex flex-col gap-3">
            <p className="font-mono text-cs-16">
              Signed in as{" "}
              <span className="text-cs-accent">{session.user.email}</span>
            </p>
            <p className="font-mono text-cs-12 text-cs-fg-muted">
              Your estimates and Rate Card are saved to your account.
            </p>
            <div>
              <Button variant="secondary" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="font-mono text-cs-12 text-cs-fg-muted">
              You are browsing anonymously. Inputs are remembered on this device
              only. Sign in to save history and build a Rate Card.
            </p>
            <div>
              <Button onClick={() => signIn("google")}>Sign In with Google</Button>
            </div>
          </div>
        )}
      </Panel>

      <Panel>
        <SectionTitle>Data</SectionTitle>
        <p className="font-mono text-cs-12 text-cs-fg-muted">
          Anonymous inputs are stored in your browser&apos;s localStorage. Clear
          your browser data to remove them.
        </p>
      </Panel>
    </div>
  );
}
