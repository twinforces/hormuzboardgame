import { createFileRoute } from "@tanstack/react-router";
import { AppChrome } from "@/view/chrome";
import { ReceiptsPage } from "@/view/receipts-page";

export const Route = createFileRoute("/receipts")({ component: Receipts });

function Receipts() {
  return (
    <AppChrome>
      <ReceiptsPage />
    </AppChrome>
  );
}
