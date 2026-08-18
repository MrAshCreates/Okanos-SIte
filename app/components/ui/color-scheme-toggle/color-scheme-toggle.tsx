import { Sun, Moon } from "lucide-react";
import { useColorScheme } from "@dazl/color-scheme/react";
import { Button } from "~/components/ui/button/button";
import style from "./color-scheme-toggle.module.css";

interface ColorSchemeToggleProps {
  className?: string;
}

export function ColorSchemeToggle({ className }: ColorSchemeToggleProps) {
  const { resolvedScheme, setColorScheme } = useColorScheme();

  const toggleTheme = () => {
    setColorScheme(resolvedScheme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedScheme === "light" ? "dark" : "light"} theme`}
      className={className}
    >
      {resolvedScheme === "light" ? <Sun /> : <Moon />}
    </Button>
  );
}
