// components/ViewProductTracker.tsx
"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

export default function ViewProductTracker({
  name,
  price,
}: {
  name: string;
  price: number;
}) {
  useEffect(() => {
    track("View Product", { name, price });
  }, [name, price]);

  return null;
}
