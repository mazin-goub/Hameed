import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import "./index.css";
import App from "./App";

// const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convex = new ConvexReactClient(convexUrl);

<ConvexProvider client={convex}>
  <App />
</ConvexProvider>

createRoot(document.getElementById("root")!).render(
  <ConvexAuthProvider client={convex}>
    <App />
  </ConvexAuthProvider>,
);
