// NextTopLoader.tsx
"use client";

import Loader from "nextjs-toploader";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NProgress from "nprogress";

export default function NextTopLoader() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.done();
  }, [pathname]);

  return <Loader showSpinner={false} />;
}
