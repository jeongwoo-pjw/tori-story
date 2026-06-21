import { useState, useEffect } from "react";
import { getLibrary, type LibraryEntry } from "@/services/library";

export function useLibrary(): LibraryEntry[] {
  const [library, setLibrary] = useState<LibraryEntry[]>(getLibrary);

  useEffect(() => {
    const refresh = () => setLibrary(getLibrary());
    window.addEventListener("tori:library-updated", refresh);
    return () => window.removeEventListener("tori:library-updated", refresh);
  }, []);

  return library;
}
