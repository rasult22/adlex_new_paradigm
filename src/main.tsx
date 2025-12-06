import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { HomeScreen } from "@/pages/home-screen";
import { NotFound } from "@/pages/not-found";
import { RouteProvider } from "@/providers/router-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import "@/styles/globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queries/client";
import { CopilotKit } from "@copilotkit/react-core";
import { CreateLicenseApplicationScreen } from "./pages/create-license-application";
import { AuthScreen } from "./pages/sign-in";
import { ProfileScreen } from "./pages/profile";
import { ProtectedRoute } from "./components/protected-route";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <CopilotKit 
                        publicApiKey="ck_pub_017bce038f7afc92dd4b8818e4b7ab5d"
                        agent="adlex"
                        // runtimeUrl="https://agent.adlex.azamat.ai/api/v1/agent"
                    >
                        <BrowserRouter>
                            <RouteProvider>
                                <Routes>
                                    <Route path="/" element={
                                        <ProtectedRoute>
                                            <HomeScreen />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/create-license-application" element={
                                        <ProtectedRoute>
                                            <CreateLicenseApplicationScreen />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/profile" element={
                                        <ProtectedRoute>
                                            <ProfileScreen />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/auth" element={<AuthScreen />} />
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </RouteProvider>
                        </BrowserRouter>
                    </CopilotKit>
                </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    </StrictMode>,
);
