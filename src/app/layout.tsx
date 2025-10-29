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
