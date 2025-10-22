// src/components/common/ClientOnly.tsx (or a similar location)
import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
}

/**
 * Renders its children only on the client-side after the initial render/hydration.
 * Prevents rendering client-side-only components on the server during SSR.
 */
const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This useEffect runs only on the client after the initial render/hydration.
    // Setting state here triggers a client-side re-render with children.
    if (typeof window !== 'undefined') { // Extra safety check
       setIsClient(true);
    }
  }, []); // Empty dependency array ensures this runs once after mount

  // On the server (isClient is false) and initially on the client before useEffect runs, render null.
  // After useEffect runs on the client, isClient becomes true, and children are rendered.
  return isClient ? <>{children}</> : null;
};

export default ClientOnly;