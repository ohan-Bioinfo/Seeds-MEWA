import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import GenomicsHub from "./pages/GenomicsHub";
import SeedersExchange from "./pages/SeedersExchange";
import ResearchHub from "./pages/ResearchHub";
import Community from "./pages/Community";
import Contact from "./pages/Contact";
import About from "./pages/About";
import DataCatalog from "./pages/DataCatalog";
import GeneticFingerprints from "./pages/GeneticFingerprints";
import Centers from "./pages/Centers";
import InventoryTracking from "./pages/InventoryTracking";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/catalog"} component={DataCatalog} />
      <Route path={"/fingerprints"} component={GeneticFingerprints} />
      <Route path={"/centers"} component={Centers} />
      <Route path={"/inventory"} component={InventoryTracking} />
      <Route path={"/genomics"} component={GenomicsHub} />
      <Route path={"/exchange"} component={SeedersExchange} />
      <Route path={"/research"} component={ResearchHub} />
      <Route path={"/community"} component={Community} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/about"} component={About} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
