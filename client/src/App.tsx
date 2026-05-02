import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import GenomicsHub from "./pages/GenomicsHub";
// SeedersExchange merged into Centers
import ResearchHub from "./pages/ResearchHub";
// Community merged into ResearchHub
import Contact from "./pages/Contact";
import About from "./pages/About";
import DataCatalog from "./pages/DataCatalog";
import GeneticFingerprints from "./pages/GeneticFingerprints";
import Centers from "./pages/Centers";
import InventoryTracking from "./pages/InventoryTracking";
import AIPrediction from "./pages/AIPrediction";
// SubmitData merged into GenomicsHub

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/catalog"} component={DataCatalog} />
      <Route path={"/fingerprints"} component={GeneticFingerprints} />
      <Route path={"/centers"} component={Centers} />
      <Route path={"/inventory"} component={InventoryTracking} />
      <Route path={"/genomics"} component={GenomicsHub} />
      {/* Exchange merged into /centers */}
      <Route path={"/research"} component={ResearchHub} />
      {/* Submit merged into /genomics */}
      {/* Community merged into /research */}
      <Route path={"/ai-prediction"} component={AIPrediction} />
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
