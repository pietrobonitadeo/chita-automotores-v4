import type { Metadata } from "next"
import { Montserrat, Inter } from "next/font/google"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800", "900"],
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Chita Automotores — Autos 0km y Usados | Concepción del Uruguay",
  description:
    "Concesionaria de autos 0km y usados en Concepción del Uruguay, Entre Ríos. 40 años de trayectoria. Tomamos tu usado y financiamos.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
