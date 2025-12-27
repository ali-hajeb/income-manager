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
        icon: '/mali/favicon.ico',
        shortcut: '/mali/favicon.ico',
        apple: '/mali/apple-touch-icon.png',
    },
    manifest: '/mali/site.webmanifest'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="fa" dir="rtl">
            <head>
                <link rel="icon" href="/mali/favicon.ico" type="image/x-icon" />
                <link rel="shortcut icon" href="/mali/favicon.ico" type="image/x-icon" />
                <link rel="apple-touch-icon" href="/mali/apple-touch-icon.png" />
                <link rel="manifest" href="/mali/site.webmanifest" />
            </head>
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
