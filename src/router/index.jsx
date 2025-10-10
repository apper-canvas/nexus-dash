import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/organisms/Layout";

const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Contacts = lazy(() => import("@/components/pages/Contacts"));
const ContactDetail = lazy(() => import("@/components/pages/ContactDetail"));
const Pipeline = lazy(() => import("@/components/pages/Pipeline"));
const Activities = lazy(() => import("@/components/pages/Activities"));

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading.....</div>}>
        <Dashboard />
      </Suspense>
    )
  },
  {
    path: "contacts",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading.....</div>}>
        <Contacts />
      </Suspense>
    )
  },
  {
    path: "contacts/:contactId",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading.....</div>}>
        <ContactDetail />
      </Suspense>
    )
  },
  {
    path: "pipeline",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading.....</div>}>
        <Pipeline />
      </Suspense>
    )
  },
  {
    path: "activities",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading.....</div>}>
        <Activities />
      </Suspense>
    )
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);