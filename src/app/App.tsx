import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { CampaignProvider } from "./context/CampaignContext";

export default function App() {
  return (
    <AuthProvider>
      <CampaignProvider>
        <RouterProvider router={router} />
      </CampaignProvider>
    </AuthProvider>
  );
}
