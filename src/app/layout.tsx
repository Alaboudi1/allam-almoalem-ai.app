import Footer from "@/components/Footer"
import { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "علام المعلم - المساعد الذكي لدعم التعليم",
  description: "علام المعلم هو مساعد ذكي مصمم خصيصاً لدعم المعلمين والطلاب في تحسين عملية التعليم باستخدام الذكاء الاصطناعي.",
  keywords: ["علام المعلم", "مساعد ذكي", "تعليم", "تقنيات تعليمية", "ذكاء اصطناعي", "تعلم", "تطوير التعليم"],
  authors: [{ name: "عبدالعزيز العبودي" }],
  creator: "عبدالعزيز العبودي",
  publisher: "عبدالعزيز العبودي",
  openGraph: {
    title: "علام المعلم - المساعد الذكي لدعم التعليم",
    description: "اكتشف كيف يمكن لعلام المعلم تسهيل التعليم وتحسين تجربة المعلمين والطلاب باستخدام أدوات الذكاء الاصطناعي المبتكرة.",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: '/images/allam-male.jpg',
        width: 1200,
        height: 630,
        alt: 'علام المعلم - المساعد الذكي لدعم التعليم'
      },
      {
        url: '/images/allam-female.jpg',
        width: 1200,
        height: 630,
        alt: 'علام المعلم - دعم شامل للتعليم'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "علام المعلم - مساعد ذكي لدعم المعلمين والطلاب",
    description: "دعم تعليمي شامل باستخدام الذكاء الاصطناعي للارتقاء بعملية التعليم والتعلم.",
    images: ['/images/og-image.jpg']
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen scroll-auto antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-gray-950`}
      >
        <ThemeProvider defaultTheme="light" attribute="class">
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
