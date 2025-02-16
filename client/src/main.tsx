import App from "@/App.tsx";
import { UserProvider } from "@/providers/UserProvider.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css";
import { WalletProvider } from "./providers/WalletProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <WalletProvider>
          <App />
        </WalletProvider>
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>
);
