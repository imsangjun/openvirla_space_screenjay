import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Archive } from "./components/Archive";
import { Campaign } from "./components/Campaign";
import { Login } from "./components/Login";
import { Admin } from "./components/Admin";
import { MyPage } from "./components/MyPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "campaign", Component: Campaign },
      { path: "archive", Component: Archive },
      { path: "login", Component: Login },
      { path: "codeking1234!", Component: Admin },
      { path: "mypage", Component: MyPage },
    ],
  },
]);
