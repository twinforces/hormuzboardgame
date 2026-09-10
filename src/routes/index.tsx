import { createFileRoute } from "@tanstack/react-router";
import { AppChrome } from "@/view/chrome";
import { PlayPage } from "@/view/play-page";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <AppChrome>
      <PlayPage />
    </AppChrome>
  );
}
