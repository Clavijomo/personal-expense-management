import { useEffect, useState } from "react";

export function useHydration() {
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setHydrated(true);
    } catch {
      setError("Error al cargar los datos. Intenta recargar la página.");
    }
  }, []);

  return { hydrated, error };
}
