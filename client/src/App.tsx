import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthProvider from "@/components/auth/AuthProvider";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PropFirms from "@/pages/PropFirms";
import FirmDetail from "@/pages/FirmDetail";
import Compare from "@/pages/Compare";
import Resources from "@/pages/Resources";
import Reviews from "@/pages/Reviews";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/firms" component={PropFirms} />
      <Route path="/firms/:id" component={FirmDetail} />
      <Route path="/compare" component={Compare} />
      <Route path="/resources" component={Resources} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/admin" component={Admin} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Navbar />
          <Toaster />
          <Router />
          <Footer />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
