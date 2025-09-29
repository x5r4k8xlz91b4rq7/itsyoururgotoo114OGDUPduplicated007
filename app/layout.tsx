import './globals.css';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import { HeaderVisibilityProvider } from '@/context/header-visibility-context';
import { DemoFormProvider } from '@/context/demo-form-context';
import DemoFormRootMount from '@/components/DemoFormRootMount';
import Footer from '@/components/footer';

// Dynamically load cursor aura with SSR disabled to prevent hydration errors
const CursorAura = dynamic(() => import('@/components/cursor-aura'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Ai Thumbs Solutions - Advanced AI Technology Services',
  description: 'Transform your business with cutting-edge AI solutions. Expert consulting, custom development, and enterprise AI integration services.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            <DemoFormProvider>
              <HeaderVisibilityProvider>
                <CursorAura />
                <Header />
                <main>
                  {children}
                </main>
                <Footer />
                <DemoFormRootMount />
              </HeaderVisibilityProvider>
            </DemoFormProvider>
            <Toaster 
              position="top-center"
              toastOptions={{
                classNames: {
                  toast: "z-[9999] mt-[calc(env(safe-area-inset-top)+96px)]",
                },
              }}
            />
          </ThemeProvider>
      </body>
    </html>
  );
}