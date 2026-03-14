import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/admin/Dashboard";
import ProductsPage from "./pages/admin/Products";
import InventoryPage from "./pages/admin/Inventory";
import PromotionsPage from "./pages/admin/Promotions";
import SettingsPage from "./pages/admin/Settings";
import CheckoutPage from "./pages/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmation";
import OrdersPage from "./pages/Orders";
import LoginPage from "./pages/Login";
import ShippingPage from "./pages/Shipping";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* Public Routes */}
      <Route path={"/"} component={Home} />
      <Route path={"/product/:id"} component={ProductDetail} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout"} component={CheckoutPage} />
      <Route path={"/order-confirmation"} component={OrderConfirmationPage} />
      <Route path={"/orders"} component={OrdersPage} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/login"} component={LoginPage} />
      <Route path={"/shipping"} component={ShippingPage} />
      
      {/* Admin Routes */}
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/products"} component={ProductsPage} />
      <Route path={"/admin/products/new"} component={ProductsPage} />
      <Route path={"/admin/inventory"} component={InventoryPage} />
      <Route path={"/admin/promotions"} component={PromotionsPage} />
      <Route path={"/admin/settings/:tab"} component={SettingsPage} />
      <Route path={"/admin/settings/site"} component={SettingsPage} />
      <Route path={"/admin/settings/layout"} component={SettingsPage} />
      <Route path={"/admin/settings/users"} component={SettingsPage} />
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
