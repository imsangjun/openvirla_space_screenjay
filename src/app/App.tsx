import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CampaignProvider } from "./context/CampaignContext";

export default function App() {
  return (
    <CampaignProvider>
      <RouterProvider router={router} />
    </CampaignProvider>
  );
}
