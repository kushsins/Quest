import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";

import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/utils";

interface InlineEditableTextProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  disabled?: boolean;
  multiline?: boolean;
  placeholder?: string;
  emptyText?: string;
  displayClassName?: string;
  inputClassName?: string;
}

export function InlineEditableText({
  value,
  onSave,
  disabled = false,
  multiline = false,
  placeholder,
  emptyText = "No value provided.",
  displayClassName,
  inputClassName,
}: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setDraft(value);
    }
  }, [isEditing, value]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const cancelEdit = () => {
    setDraft(value);
    setIsEditing(false);
  };

  const saveEdit = async () => {
    const trimmed = draft.trim();

    if (!multiline && trimmed.length === 0) {
      cancelEdit();
      return;
    }

    if (trimmed === value.trim()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);

    try {
      await onSave(trimmed);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (event.key === "Escape") {
      event.preventDefault();
      cancelEdit();
      return;
    }

    if (event.key === "Enter" && !multiline) {
      event.preventDefault();
      void saveEdit();
      return;
    }

    if (event.key === "Enter" && multiline && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      void saveEdit();
    }
  };

  if (isEditing) {
    if (multiline) {
      return (
        <Textarea
          ref={inputRef as RefObject<HTMLTextAreaElement>}
          value={draft}
          disabled={isSaving}
          placeholder={placeholder}
          rows={4}
          className={cn("min-h-[5rem]", inputClassName)}
          onChange={(event) => {
            setDraft(event.target.value);
          }}
          onBlur={() => {
            void saveEdit();
          }}
          onKeyDown={handleKeyDown}
        />
      );
    }

    return (
      <Input
        ref={inputRef as RefObject<HTMLInputElement>}
        value={draft}
        disabled={isSaving}
        placeholder={placeholder}
        className={inputClassName}
        onChange={(event) => {
          setDraft(event.target.value);
        }}
        onBlur={() => {
          void saveEdit();
        }}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <div
      role={disabled ? undefined : "button"}
      tabIndex={disabled ? undefined : 0}
      title={disabled ? undefined : "Double-click to edit"}
      className={cn(
        "rounded-md outline-none transition-colors",
        !disabled &&
          "cursor-text hover:bg-[var(--glass-surface-subtle)] focus-visible:ring-2 focus-visible:ring-ring",
        displayClassName,
      )}
      onDoubleClick={() => {
        if (!disabled) {
          setIsEditing(true);
        }
      }}
      onKeyDown={(event) => {
        if (disabled) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsEditing(true);
        }
      }}
    >
      {value ? (
        <span className={multiline ? "whitespace-pre-wrap" : undefined}>
          {value}
        </span>
      ) : (
        <span className="text-muted-foreground">{emptyText}</span>
      )}
    </div>
  );
}
