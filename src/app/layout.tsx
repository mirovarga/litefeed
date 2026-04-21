import { GeistMono } from "geist/font/mono"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "LiteFeed",
  description: "A lightweight feed reader",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={`${GeistMono.variable} antialiased`} lang="en">
      <body className="font-mono text-[14px] text-foreground leading-relaxed">
        {children}
      </body>
    </html>
  )
}
