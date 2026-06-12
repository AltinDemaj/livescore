"use client";

import { useEffect, useState } from "react";

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const detect = () => {
      const ua = navigator.userAgent;
      const mobileUa = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
      setIsMobile(mediaQuery.matches || mobileUa);
    };

    detect();
    mediaQuery.addEventListener("change", detect);
    return () => mediaQuery.removeEventListener("change", detect);
  }, []);

  return isMobile;
};
