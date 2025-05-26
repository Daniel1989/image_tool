import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import  SpeedInsights  from "@vercel/speed-insights/astro"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "./components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free Online Image Tools - Resize, Convert, Compress & Set Resolution | Image Editor | 免费在线图片工具",
  description: "Professional online image editing tools. Resize images, convert formats (JPEG, PNG, WebP), compress files, set DPI/PPI resolution for print. Fast, secure, and completely free browser-based image processing. | 专业的在线图片编辑工具。调整图片大小，转换格式(JPEG, PNG, WebP)，压缩文件，设置打印DPI/PPI分辨率。快速，安全，完全免费的浏览器图片处理工具。",
  keywords: [
    // English Core tools
    "image resize", "image converter", "image compressor", "image resolution",
    
    // English Specific functionalities
    "resize image online", "convert image format", "compress image", "set image dpi",
    "change image resolution", "image optimizer", "photo resizer", "picture converter",
    
    // English File formats
    "jpeg converter", "png converter", "webp converter", "jpg to png", "png to jpg",
    "webp to jpg", "image format converter", "photo format changer",
    
    // English Resolution & printing
    "set image dpi", "change image ppi", "print resolution", "72 dpi web", "300 dpi print",
    "600 dpi professional", "image dimensions", "pixel dimensions",
    
    // English Quality & compression
    "reduce image size", "compress photo", "image quality", "optimize images",
    "reduce file size", "image compression tool", "photo optimizer",
    
    // English General terms
    "online image editor", "free image tools", "browser image editor", "web image processor",
    "photo editing tools", "image manipulation", "bulk image processing", "batch image resize",
    
    // Chinese Core tools - 中文核心工具
    "图片调整大小", "图片转换器", "图片压缩", "图片分辨率", "在线图片编辑",
    
    // Chinese Specific functionalities - 中文具体功能
    "在线调整图片大小", "图片格式转换", "压缩图片", "设置图片dpi", "修改图片分辨率",
    "图片优化", "照片调整大小", "图片转换工具", "在线图片处理",
    
    // Chinese File formats - 中文文件格式
    "jpeg转换器", "png转换器", "webp转换器", "jpg转png", "png转jpg",
    "webp转jpg", "图片格式转换器", "照片格式转换", "图片格式转换工具",
    
    // Chinese Resolution & printing - 中文分辨率和打印
    "设置图片dpi", "修改图片ppi", "打印分辨率", "网页72dpi", "打印300dpi",
    "专业600dpi", "图片尺寸", "像素尺寸", "图片像素",
    
    // Chinese Quality & compression - 中文质量和压缩
    "减小图片大小", "压缩照片", "图片质量", "优化图片", "减少文件大小",
    "图片压缩工具", "照片优化器", "图片优化工具",
    
    // Chinese General terms - 中文通用术语
    "在线图片编辑器", "免费图片工具", "浏览器图片编辑", "网页图片处理器",
    "照片编辑工具", "图片处理", "批量图片处理", "批量调整图片大小", "免费在线工具"
  ].join(", "),
  authors: [{ name: "Image Tools | 图片工具" }],
  creator: "Image Tools | 图片工具",
  publisher: "Image Tools | 图片工具",
  robots: "index, follow",
  openGraph: {
    title: "Free Online Image Tools - Resize, Convert, Compress & Set Resolution | 免费在线图片工具",
    description: "Professional online image editing tools. Resize images, convert formats, compress files, and set DPI/PPI resolution. Fast, secure, and completely free. | 专业的在线图片编辑工具。调整图片大小，转换格式，压缩文件，设置DPI/PPI分辨率。快速，安全，完全免费。",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN", "zh_TW"],
    siteName: "Image Tools | 图片工具"
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Image Tools - Professional Image Editor | 免费在线图片编辑器",
    description: "Resize, convert, compress images and set resolution online. Support for JPEG, PNG, WebP formats. Free and secure browser-based image processing. | 在线调整图片大小，转换格式，压缩图片和设置分辨率。支持JPEG, PNG, WebP格式。免费安全的浏览器图片处理。"
  },
  alternates: {
    canonical: "/",
    languages: {
      'en': '/',
      'zh-CN': '/',
      'zh-TW': '/'
    }
  },
  other: {
    "application-name": "Image Tools | 图片工具",
    "msapplication-TileColor": "#2563eb",
    "theme-color": "#2563eb",
    "google": "notranslate" // Prevent auto-translation since we provide both languages
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="alternate" hrefLang="en" href="/" />
        <link rel="alternate" hrefLang="zh-CN" href="/" />
        <link rel="alternate" hrefLang="zh-TW" href="/" />
        <link rel="alternate" hrefLang="x-default" href="/" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
