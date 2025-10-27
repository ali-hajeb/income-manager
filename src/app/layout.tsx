import type { Metadata } from "next";
import { createTheme, DirectionProvider, MantineProvider } from "@mantine/core";
import "vazirmatn/Vazirmatn-font-face.css"
import '@mantine/core/styles.css';
import "./globals.css";

const theme = createTheme({});

export const metadata: Metadata = {
  title: "SAMT | سامانه مدیریت تسهیم درآمد",
  description: "سامانه مدیریت تسهیم درآمد",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="fa" dir="rtl">
            <link rel="icon" type="image/png" href="./favicon-96x96.png" sizes="96x96" />
            <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
            <link rel="shortcut icon" href="./favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png" />
            <meta name="apple-mobile-web-app-title" content="SAMT" />
            <link rel="manifest" href="./site.webmanifest" />
            <body>
                <DirectionProvider initialDirection="rtl">
                    <MantineProvider theme={theme}>
                        {children}
                    </MantineProvider>
                </DirectionProvider>
            </body>
        </html>
  );
}
