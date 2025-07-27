import React, { PropsWithChildren, useState } from "react";
import Navbar from "./navbar";
import Chatbot from "./chatbot";
import Footer from "./footer";
import { LanguageDirectionProvider } from "@/helpers/langDirection";
import { useRouter } from "next/router";
import WelcomeScreen from "./WelcomeScreen";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: PropsWithChildren<LayoutProps>) => {
    const router = useRouter();
    const { asPath } = router;
    const [showHome, setShowHome] = useState(false);
    
    const handleWelcomeComplete = () => {
      setShowHome(true);
    };
    
    const isAdminRoute = asPath.split('/').includes('admin');

    return (  
        <LanguageDirectionProvider>
            {isAdminRoute|| !showHome? null : <Navbar />}
                {isAdminRoute? null :<WelcomeScreen onWelcomeComplete={handleWelcomeComplete} />}
                {!isAdminRoute?  showHome && (
                    <main>
                        {children}
                    </main>
                ): (
                    <main>
                        {children}
                    </main>
                )}            
            {isAdminRoute || !showHome? null : <Chatbot />}
            {isAdminRoute || !showHome? null : <Footer />} 
        </LanguageDirectionProvider>
    );
}

export default Layout;
