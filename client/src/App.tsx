import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainApp from "./MainApp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
