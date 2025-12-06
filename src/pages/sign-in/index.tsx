import { AdlexLogo } from "@/components/adlex-logo";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import { BackgroundPattern } from "@/components/shared-assets/background-patterns";
import { useState } from "react";
import { LoginSimple } from "./components/sign-in";
import { SignupSimple } from "./components/sign-up";


const tabs = [
    { id: "signup", label: "Sign up" },
    { id: "login", label: "Log in" },
];

export const AuthScreen = () => {
   const [selectedTabIndex, setSelectedTabIndex] = useState<string | number>("signup");

    return (
        <section className="relative min-h-screen overflow-hidden bg-primary px-4 py-12 md:px-8 md:pt-24">
            <div className="relative z-10 mx-auto flex w-full flex-col gap-8 sm:max-w-90">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="relative">                        
                        <div className="z-[10] relative">
                          <AdlexLogo className="w-[100px]"/>
                        </div>
                        <BackgroundPattern pattern="grid" className="absolute top-1/2 left-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 md:block" />
                        <BackgroundPattern pattern="grid" size="md" className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 md:hidden" />
                    </div>
                    <div className="z-10 flex flex-col gap-2 md:gap-3">
                        {
                          selectedTabIndex === 'login' && (
                            <>
                              <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Log in to your account</h1>
                              <p className="self-stretch p-0 text-md text-tertiary">Welcome back! Please enter your details.</p>
                            </>
                          )
                        }
                        {
                          selectedTabIndex === 'signup' && (
                            <>
                              <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Create an account</h1>
                              <p className="self-stretch p-0 text-md text-tertiary">Start your 30-day free trial.</p>
                            </>
                          )
                        }
                    </div>
                    <Tabs selectedKey={selectedTabIndex} onSelectionChange={setSelectedTabIndex} className="z-10 w-full">
                        <TabList fullWidth size="sm" type="button-minimal" items={tabs} />
                    </Tabs>
                </div>
                {
                  selectedTabIndex === 'login' && <LoginSimple changeTab={() => {
                    setSelectedTabIndex('signup')
                  }} />
                }
                {
                  selectedTabIndex === 'signup' && <SignupSimple changeTab={() => {
                    setSelectedTabIndex('login')
                  }} />
                }
            </div>
        </section>
    );
};
