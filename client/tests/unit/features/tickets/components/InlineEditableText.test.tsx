import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { InlineEditableText } from "@/features/tickets/components/InlineEditableText";

describe("InlineEditableText", () => {
  it("shows the value as read-only text by default", () => {
    render(<InlineEditableText value="Original title" onSave={vi.fn()} />);

    expect(screen.getByText("Original title")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("shows the empty text when there is no value", () => {
    render(
      <InlineEditableText
        value=""
        onSave={vi.fn()}
        emptyText="No description"
      />,
    );

    expect(screen.getByText("No description")).toBeInTheDocument();
  });

  it("enters edit mode on double click", async () => {
    const user = userEvent.setup();
    render(<InlineEditableText value="Title" onSave={vi.fn()} />);

    await user.dblClick(screen.getByText("Title"));

    expect(screen.getByRole("textbox")).toHaveValue("Title");
  });

  it("saves the trimmed value on Enter", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<InlineEditableText value="Title" onSave={onSave} />);

    await user.dblClick(screen.getByText("Title"));
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "  Updated title  ");
    await user.keyboard("{Enter}");

    expect(onSave).toHaveBeenCalledWith("Updated title");
  });

  it("does not save when the value is unchanged", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<InlineEditableText value="Title" onSave={onSave} />);

    await user.dblClick(screen.getByText("Title"));
    await user.keyboard("{Enter}");

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("cancels editing on Escape without saving", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<InlineEditableText value="Title" onSave={onSave} />);

    await user.dblClick(screen.getByText("Title"));
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "Discarded");
    await user.keyboard("{Escape}");

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("does not enter edit mode when disabled", async () => {
    const user = userEvent.setup();
    render(<InlineEditableText value="Title" onSave={vi.fn()} disabled />);

    await user.dblClick(screen.getByText("Title"));

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
