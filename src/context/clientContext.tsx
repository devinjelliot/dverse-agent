// Description: This file contains the client context that is used to store the client id of the user.
// Path: chatbot-demo/src/context/clientContext.tsx
import { createContext, useContext, useState } from "react";

interface ClientContextProps {
  clientId: string | null;
  setClientId: (clientId: string) => void;
}

const ClientContext = createContext<ClientContextProps>({
  clientId: null,
  setClientId: () => {},
});

export const useClientContext = () => useContext(ClientContext);

interface ClientContextProviderProps {
  children: React.ReactNode;
}

export const ClientContextProvider: React.FC<ClientContextProviderProps> = ({ children }) => {
  const [clientId, setClientId] = useState<string | null>(null);

  return (
    <ClientContext.Provider value={{ clientId, setClientId }}>
      {children}
    </ClientContext.Provider>
  );
};
