import { type FC, type PropsWithChildren, useEffect, useState } from "react";

export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

const ClientOnly: FC<PropsWithChildren> = ({ children }) => {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return <>{children}</>;
};

export default ClientOnly;
