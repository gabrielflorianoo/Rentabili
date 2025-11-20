"use client";

import { useTheme } from "@/components/themeProvider";

export default function DarkModeToggle() {
  const { dark, toggleDark } = useTheme();

  return (
    <button onClick={toggleDark}>
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
