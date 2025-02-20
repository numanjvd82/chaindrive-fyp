import App from "@/App.tsx";
import { UserProvider } from "@/providers/UserProvider.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css";
import { SocketProvider } from "./providers/SocketProvider";
import { WalletProvider } from "./providers/WalletProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SocketProvider>
          <WalletProvider>
            <App />
          </WalletProvider>
        </SocketProvider>
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>
);
