import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OAuthMain from "./components/OAuthMain";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OAuthMain />} />
        <Route path="/callback" element={<OAuthMain />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
