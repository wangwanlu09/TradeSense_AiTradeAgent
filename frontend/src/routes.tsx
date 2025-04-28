import { Home, Stock, Crypto, StockNews, CryptoNews } from "./pages";
import { ReactElement } from "react";
import { RouteObject } from "react-router-dom";
import { Outlet } from "react-router-dom";

export interface AppRoute {
  name: string;
  path: string;
  element: ReactElement;
  children?: AppRoute[];
}

function NewsLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export const routes: AppRoute[] = [
  {
    name: "Home",
    path: "/home",
    element: <Home />,
  },
  {
    name: "News",
    path: "/news",
    element: <NewsLayout />,
    children: [
      {
        name: "Stock News",
        path: "stock_news",
        element: <StockNews />,
      },
      {
        name: "Crypto News",
        path: "crypto_news",
        element: <CryptoNews />,
      },
    ],
  },
  {
    name: "Stock",
    path: "/stock",
    element: <Stock />,
  },
  {
    name: "Crypto",
    path: "/crypto",
    element: <Crypto />,
  },
];

// Convert to a format accepted by react-router-dom v7, supporting nested routes.
export const routerConfig: RouteObject[] = routes.map(({ path, element, children }) => {
  const routeObj: RouteObject = { path, element };

  if (children) {
    routeObj.children = children.map(child => ({
      path: child.path,
      element: child.element,
    }));
  }

  return routeObj;
});

export default routes;
