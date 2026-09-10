import { createFileRoute } from "@tanstack/react-router";
import { AppChrome } from "@/view/chrome";
import { BriefingPage } from "@/view/briefing";

export const Route = createFileRoute("/briefing")({ component: Briefing });

function Briefing() {
  return (
    <AppChrome>
      <BriefingPage />
    </AppChrome>
  );
}
