import type { Metadata } from "next";
import { createTheme, DirectionProvider, MantineProvider } from "@mantine/core";
import "vazirmatn/Vazirmatn-font-face.css"
import '@mantine/core/styles.css';
import "./globals.css";

const theme = createTheme({});

export const metadata: Metadata = {
    title: "SAMT | سامانه مدیریت تسهیم درآمد",
    description: "سامانه مدیریت تسهیم درآمد",
    icons: {
        icon: '/itrpt/favicon.ico',
        shortcut: '/itrpt/favicon.ico',
        apple: '/itrpt/apple-touch-icon.png',
    },
    manifest: '/itrpt/site.webmanifest'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="fa" dir="rtl">
            <body>
                <DirectionProvider initialDirection="rtl">
                    <MantineProvider theme={theme}>
                        {children}
                    </MantineProvider>
                </DirectionProvider>
                <footer>
                  <center>
                    <span style={{color: '#f9f9f9'}}>Copyright &copy; 2025-2026 By Ali Hajeb</span>
                  </center>
                </footer>
            </body>
        </html>
  );
}
