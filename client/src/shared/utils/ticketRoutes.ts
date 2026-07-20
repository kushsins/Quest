import type { TicketView } from "@/shared/types/ticket.types";

export function getTicketUrl(
  ticketId: string,
  view: TicketView = "panel",
): string {
  const params = new URLSearchParams();
  params.set("ticketId", ticketId);

  if (view === "expanded") {
    params.set("view", "expanded");
  }

  return `/tickets?${params.toString()}`;
}

export function openTicketInNewTab(ticketId: string): void {
  window.open(
    getTicketUrl(ticketId, "expanded"),
    "_blank",
    "noopener,noreferrer",
  );
}
