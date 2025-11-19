"use client";

import { Sun, Moon } from "lucide-react";
import styles from "@/components/css/darkMode.module.css";

interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function DarkModeToggle({ darkMode, setDarkMode }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Sun className={styles.iconSun} />

      <div
        className={styles.switch}
        data-state={darkMode ? "checked" : "unchecked"}
        onClick={() => setDarkMode(!darkMode)}
      >
        <div className={styles.thumb}></div>
      </div>

      <Moon className={styles.iconMoon} />
    </div>
  );
}
