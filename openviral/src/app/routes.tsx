import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Archive } from "./components/Archive";
import { Campaign } from "./components/Campaign";
import { Contact } from "./components/Contact";
import { Login } from "./components/Login";
import { Admin } from "./components/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "campaign", Component: Campaign },
      { path: "archive", Component: Archive },
      { path: "contact", Component: Contact },
      { path: "login", Component: Login },
      { path: "admin", Component: Admin },
    ],
  },
]);
