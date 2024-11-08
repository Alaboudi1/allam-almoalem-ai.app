"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
export default function HeroImage() {
  const [hoveredImage, setHoveredImage] = useState<"male" | "female" | null>(
    null,
  )
  const [typedText, setTypedText] = useState("")
  const maleText = "مرحبًا! أناعلام سعيد بإن أكون معلمك    "
  const femaleText = "أهلاً! أنا علامة دعنا نبدأ رحلة التعليم الممتعة"

  useEffect(() => {
    if (hoveredImage) {
      const text = hoveredImage === "male" ? maleText : femaleText
      let i = 0
      setTypedText("")
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setTypedText(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(typingInterval)
        }
      }, 60)
      return () => clearInterval(typingInterval)
    } else {
      setTypedText("")
    }
  }, [hoveredImage])

  return (
    <section aria-label="Hero Image of the website" className="flow-root">
      <div className="relative flex flex-col items-center justify-between p-4 md:flex-row">
        <div
          className="relative mb-4 w-full transition-all duration-300 md:mb-0 md:w-1/2"
          onMouseEnter={() => setHoveredImage("male")}
          onMouseLeave={() => setHoveredImage(null)}
        >
          <Link href="/books?allam=male">
            <Image
              src="/images/allam-male.jpg"
              alt="Allam Male"
              width={500}
              height={500}
              className={`cursor-pointer rounded-lg ${hoveredImage === "female" ? "blur-sm" : ""}`}
            />
          </Link>
        </div>
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white p-4 shadow-lg dark:bg-gray-800">
          <p className="whitespace-nowrap text-center text-lg text-gray-700 md:text-xl lg:text-2xl dark:text-gray-300">
            {typedText || "أختر معلمك"}
          </p>
        </div>
        <div
          className="relative w-full transition-all duration-300 md:w-1/2"
          onMouseEnter={() => setHoveredImage("female")}
          onMouseLeave={() => setHoveredImage(null)}
        >
          <Link href="/books?allam=female">
            <Image
              src="/images/allam-female.jpg"
              alt="Allam Female"
              width={500}
              height={500}
              className={`cursor-pointer rounded-lg ${hoveredImage === "male" ? "blur-sm" : ""}`}
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
