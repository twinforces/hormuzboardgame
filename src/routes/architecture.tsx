import { createFileRoute } from "@tanstack/react-router";
import { AppChrome } from "@/view/chrome";
import { ArchitecturePage } from "@/view/architecture-page";

export const Route = createFileRoute("/architecture")({ component: Architecture });

function Architecture() {
  return (
    <AppChrome>
      <ArchitecturePage />
    </AppChrome>
  );
}
