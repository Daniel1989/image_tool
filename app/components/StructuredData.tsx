export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": {
      "@value": "Image Tools",
      "@language": "en"
    },
    "alternateName": [
      {
        "@value": "图片工具", 
        "@language": "zh-CN"
      },
      {
        "@value": "圖片工具",
        "@language": "zh-TW"
      }
    ],
    "description": {
      "@value": "Professional online image editing tools. Resize images, convert formats, compress files, and set DPI/PPI resolution.",
      "@language": "en"
    },
    "url": typeof window !== 'undefined' ? window.location.origin : "https://your-domain.com",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Image Resizing",
      "Format Conversion", 
      "Image Compression",
      "Resolution Setting",
      "DPI/PPI Adjustment"
    ],
    "softwareVersion": "1.0",
    "applicationSubCategory": "Image Editor",
    "screenshot": typeof window !== 'undefined' ? `${window.location.origin}/screenshot.png` : undefined,
    "inLanguage": ["en", "zh-CN", "zh-TW"],
    "availableLanguage": [
      {
        "@type": "Language",
        "name": "English",
        "alternateName": "en"
      },
      {
        "@type": "Language", 
        "name": "简体中文",
        "alternateName": "zh-CN"
      },
      {
        "@type": "Language",
        "name": "繁體中文", 
        "alternateName": "zh-TW"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 