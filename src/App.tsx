import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Dashboard } from "./pages/Dashboard";
import { TopRated } from "./pages/TopRated";
import { Popular } from "./pages/Popular";
import { Search } from "./pages/Search";
import { Details } from "./pages/Details";
import { ErrorState } from "./components/ErrorState";
import { isApiKeyConfigured, getMissingKeyError } from "./lib/api";

function AppContent() {
  const apiKeyMissing = !isApiKeyConfigured();

  if (apiKeyMissing) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <ErrorState error={getMissingKeyError()} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/top-rated" element={<TopRated />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/search" element={<Search />} />
          <Route path="/details/:mediaType/:id" element={<Details />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
