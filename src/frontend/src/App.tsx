import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { Builder } from "./pages/Builder";
import { Cancel } from "./pages/Cancel";
import { Dashboard } from "./pages/Dashboard";
import { Landing } from "./pages/Landing";
import { Pricing } from "./pages/Pricing";
import { Success } from "./pages/Success";
import { Transactions } from "./pages/Transactions";

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pricing",
  component: Pricing,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});

const builderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/builder",
  component: Builder,
});

const builderEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/builder/$id",
  component: Builder,
});

const transactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/transactions",
  component: Transactions,
});

const successRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/success",
  component: Success,
});

const cancelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cancel",
  component: Cancel,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  pricingRoute,
  dashboardRoute,
  builderRoute,
  builderEditRoute,
  transactionsRoute,
  successRoute,
  cancelRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
