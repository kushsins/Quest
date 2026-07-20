import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

interface UseResizablePanelOptions {
  storageKey: string;
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
}

function readStoredWidth(
  storageKey: string,
  defaultWidth: number,
  minWidth: number,
  maxWidth: number,
): number {
  const stored = localStorage.getItem(storageKey);
  const parsed = stored ? Number.parseInt(stored, 10) : defaultWidth;

  if (Number.isNaN(parsed)) {
    return defaultWidth;
  }

  return Math.min(maxWidth, Math.max(minWidth, parsed));
}

function clampWidth(width: number, minWidth: number, maxWidth: number): number {
  return Math.min(maxWidth, Math.max(minWidth, width));
}

export function useResizablePanel({
  storageKey,
  defaultWidth,
  minWidth,
  maxWidth,
}: UseResizablePanelOptions) {
  const [width, setWidth] = useState(() =>
    readStoredWidth(storageKey, defaultWidth, minWidth, maxWidth),
  );
  const isDraggingRef = useRef(false);

  const persistWidth = useCallback(
    (nextWidth: number) => {
      const clamped = clampWidth(nextWidth, minWidth, maxWidth);
      setWidth(clamped);
      localStorage.setItem(storageKey, String(clamped));
    },
    [storageKey, minWidth, maxWidth],
  );

  const onResizePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      isDraggingRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);

      const startX = event.clientX;
      const startWidth = width;

      const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
        if (!isDraggingRef.current) {
          return;
        }

        const delta = startX - moveEvent.clientX;
        persistWidth(startWidth + delta);
      };

      const handlePointerUp = () => {
        isDraggingRef.current = false;
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [persistWidth, width],
  );

  useEffect(() => {
    const handleResize = () => {
      setWidth((current) => clampWidth(current, minWidth, maxWidth));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [minWidth, maxWidth]);

  return {
    width,
    onResizePointerDown,
    resetWidth: () => {
      persistWidth(defaultWidth);
    },
  };
}
