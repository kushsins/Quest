import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TicketQuickFilters } from "@/features/tickets/components/TicketQuickFilters";
import {
  QUICK_FILTERS,
  type QuickFilterId,
} from "@/features/tickets/constants/ticket.constants";

function emptyCounts(): Record<QuickFilterId, number | undefined> {
  return QUICK_FILTERS.reduce(
    (counts, filter) => {
      counts[filter.id] = undefined;
      return counts;
    },
    {} as Record<QuickFilterId, number | undefined>,
  );
}

describe("TicketQuickFilters", () => {
  it("renders a button for every quick filter", () => {
    render(
      <TicketQuickFilters
        activeFilterId="all"
        counts={emptyCounts()}
        onSelect={vi.fn()}
      />,
    );

    for (const filter of QUICK_FILTERS) {
      expect(
        screen.getByRole("button", { name: new RegExp(filter.label) }),
      ).toBeInTheDocument();
    }
  });

  it("shows a placeholder dash for undefined counts and the number otherwise", () => {
    const counts = emptyCounts();
    counts.OPEN = 7;

    render(
      <TicketQuickFilters
        activeFilterId="all"
        counts={counts}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("calls onSelect with the clicked filter id", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <TicketQuickFilters
        activeFilterId="all"
        counts={emptyCounts()}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Open/ }));

    expect(onSelect).toHaveBeenCalledWith("OPEN");
  });
});
