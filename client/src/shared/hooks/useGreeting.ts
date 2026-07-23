import { useEffect, useState } from "react";

import { getGreeting } from "@/shared/utils/greeting";

export function useGreeting(): string {
  const [greeting, setGreeting] = useState(() => getGreeting());

  useEffect(() => {
    const syncGreeting = () => {
      setGreeting(getGreeting());
    };

    syncGreeting();

    const intervalId = window.setInterval(syncGreeting, 60_000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncGreeting();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return greeting;
}
