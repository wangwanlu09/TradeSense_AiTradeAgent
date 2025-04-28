import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { routes } from "./routes";
import { Navbar, Footer } from "./widgets/layout";
import { StockNews, CryptoNews } from './pages';


function App() {
  const { pathname } = useLocation();

  return (
    <>
      <Navbar />

      <main className="pt-0">
        <Routes>
          {routes.map(({ path, element }, key) => (
            <Route
              key={key}
              path={path}
              element={element}
            />
          ))}


          <Route path="/news">
            <Route path="stock_news" element={<StockNews />} />
            <Route path="crypto_news" element={<CryptoNews />} />
          </Route>

          {/* Default route */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
        <Footer />
      </main>
    </>
  );
}

export default App;
