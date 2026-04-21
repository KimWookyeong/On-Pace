import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MainPage from "./pages/MainPage";
import BasicInfoPage from "./pages/BasicInfoPage";
import ResultPage from "./pages/ResultPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/basic" element={<BasicInfoPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;