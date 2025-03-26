import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { BrainTumorProvider } from "@/context/BrainTumorContext";
import NotFound from "@/pages/not-found";

// Import pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import Dataset from "@/pages/Dataset";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />
      <Route path="/dataset" component={Dataset} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrainTumorProvider>
        <Router />
        <Toaster />
      </BrainTumorProvider>
    </QueryClientProvider>
  );
}

export default App;
