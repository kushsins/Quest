import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";

export const SIDEBAR_COLLAPSED_KEY = "quest-sidebar-collapsed";

export type ViewportMode = "mobile" | "tablet" | "desktop";

const DESKTOP_MIN = 1024;
const TABLET_MIN = 768;

function getViewportMode(width: number): ViewportMode {
  if (width < TABLET_MIN) {
    return "mobile";
  }

  if (width < DESKTOP_MIN) {
    return "tablet";
  }

  return "desktop";
}

function readCollapsedPreference(): boolean {
  return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
}

interface SidebarContextValue {
  viewport: ViewportMode;
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined,
);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [viewport, setViewport] = useState<ViewportMode>(() =>
    getViewportMode(window.innerWidth),
  );
  const [isCollapsed, setIsCollapsed] = useState(() => readCollapsedPreference());
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [tabletInitialized, setTabletInitialized] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const nextViewport = getViewportMode(window.innerWidth);
      setViewport((current) => {
        if (current !== nextViewport && nextViewport === "tablet") {
          setIsCollapsed(true);
          setTabletInitialized(true);
        }

        if (nextViewport === "mobile") {
          setIsMobileOpen(false);
        }

        return nextViewport;
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (viewport === "tablet" && !tabletInitialized) {
      setIsCollapsed(true);
      setTabletInitialized(true);
    }
  }, [viewport, tabletInitialized]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((current) => {
      const next = !current;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((current) => !current);
  }, []);

  const value = useMemo(
    () => ({
      viewport,
      isCollapsed,
      isMobileOpen,
      toggleCollapsed,
      closeMobile,
      toggleMobile,
    }),
    [
      viewport,
      isCollapsed,
      isMobileOpen,
      toggleCollapsed,
      closeMobile,
      toggleMobile,
    ],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider.");
  }

  return context;
}
