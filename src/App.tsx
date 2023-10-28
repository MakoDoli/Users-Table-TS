import { BrowserRouter, Route, Routes } from "react-router-dom";
// import HomePage from "./features/table/HomePage";
import User from "./features/users/User";
import { Suspense, lazy } from "react";
import Spinner from "./features/ui/Spinner";
import { OverlayProvider } from "./features/contexts/OverlayContext";
import { UserProvider } from "./features/contexts/UserContext";
const Homepage = lazy(() => import("./features/table/HomePage"));
function App() {
  return (
    <OverlayProvider>
      <UserProvider>
        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/users/:userID" element={<User />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </UserProvider>
    </OverlayProvider>
  );
}

export default App;
