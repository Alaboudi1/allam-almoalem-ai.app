"use client"

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"
import React, { useEffect, useRef, useState } from "react"

pdfjsLib.GlobalWorkerOptions.workerSrc = "/changelog/pdf.worker.mjs"

interface PDFViewerProps {
  url: string
  setBox: (boxes: any) => void
}

interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, setBox }) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const [rectangles, setRectangles] = useState<{
    left: Rectangle[]
    right: Rectangle[]
  }>({ left: [], right: [] })

  const refs = {
    left: {
      canvas: useRef<HTMLCanvasElement>(null),
      overlay: useRef<HTMLCanvasElement>(null),
      container: useRef<HTMLDivElement>(null),
    },
    right: {
      canvas: useRef<HTMLCanvasElement>(null),
      overlay: useRef<HTMLCanvasElement>(null),
      container: useRef<HTMLDivElement>(null),
    },
  }

  useEffect(() => {
    setLoading(true)
    setLoadingProgress(0)
    const googleBucketUrl = `https://storage.googleapis.com/books-allam/${url}`

    const loadingTask = pdfjsLib.getDocument(googleBucketUrl)

    loadingTask.onProgress = (progressData: {
      loaded: number
      total: number
    }) => {
      const progress = (progressData.loaded / progressData.total) * 100
      setLoadingProgress(Math.round(progress))
    }

    loadingTask.promise.then(
      (pdf: any) => {
        setPdfDoc(pdf)
        setNumPages(pdf.numPages)
        setLoading(false)
      },
      (reason: any) => {
        console.error("Error loading PDF:", reason)
        setLoading(false)
      },
    )
  }, [url])

  useEffect(() => {
    if (!pdfDoc) return

    const renderPage = async (
      pdf: any,
      pageNum: number,
      side: "left" | "right",
    ) => {
      const { canvas, container } = refs[side]
      if (!canvas.current || !container.current) return

      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 0.3 })
      const scale = container.current.clientWidth / viewport.width
      const scaledViewport = page.getViewport({ scale })

      const context = canvas.current.getContext("2d")
      canvas.current.height = scaledViewport.height
      canvas.current.width = scaledViewport.width

      try {
        await page.render({ canvasContext: context, viewport: scaledViewport })
          .promise
      } catch (error) {
        console.error("Error rendering page:", error)
      }
    }

    renderPage(pdfDoc, pageNumber, "right")
    renderPage(pdfDoc, pageNumber + 1, "left")
  }, [pdfDoc, pageNumber])

  useEffect(() => {
    const setupCanvas = (side: "left" | "right") => {
      const { overlay, container, canvas } = refs[side]
      if (!overlay.current || !container.current || !canvas.current) return

      const ctx = overlay.current.getContext("2d")
      let isDrawing = false
      let startX = 0,
        startY = 0

      const resizeCanvas = () => {
        if (overlay.current && container.current) {
          overlay.current.width = container.current.clientWidth
          overlay.current.height = container.current.clientHeight
          drawAllRectangles(side)
        }
      }

      const drawAllRectangles = (side: "left" | "right") => {
        if (!ctx || !overlay.current) return
        ctx.clearRect(0, 0, overlay.current.width, overlay.current.height)
        rectangles[side].forEach((rect) => {
          ctx.beginPath()
          ctx.rect(rect.x, rect.y, rect.width, rect.height)
          ctx.strokeStyle = "black"
          ctx.lineWidth = 2
          ctx.stroke()
        })
      }

      resizeCanvas()
      window.addEventListener("resize", resizeCanvas)

      const handleMouseDown = (e: MouseEvent) => {
        const rect = overlay.current!.getBoundingClientRect()
        startX = e.clientX - rect.left
        startY = e.clientY - rect.top
        isDrawing = true
      }

      const handleMouseUp = (e: MouseEvent) => {
        if (!isDrawing || !ctx || !overlay.current || !canvas.current) return
        const rect = overlay.current.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const newRect = {
          x: startX,
          y: startY,
          width: mouseX - startX,
          height: mouseY - startY,
        }
        setRectangles((prev) => ({ ...prev, [side]: [newRect] }))

        isDrawing = false
        drawAllRectangles(side)

        // Create a temporary canvas to hold the cropped image
        const tempCanvas = document.createElement("canvas")
        const tempCtx = tempCanvas.getContext("2d")

        // Calculate the scale factor
        const scaleFactor = canvas.current.width / overlay.current.width

        // Set the temporary canvas size to match the scaled dimensions
        tempCanvas.width = Math.abs(newRect.width) * scaleFactor
        tempCanvas.height = Math.abs(newRect.height) * scaleFactor

        // Enable image smoothing for better quality
        tempCtx!.imageSmoothingEnabled = true
        tempCtx!.imageSmoothingQuality = "high"

        // Draw the cropped portion of the PDF onto the temporary canvas
        tempCtx?.drawImage(
          canvas.current,
          Math.min(startX, mouseX) * scaleFactor,
          Math.min(startY, mouseY) * scaleFactor,
          Math.abs(newRect.width) * scaleFactor,
          Math.abs(newRect.height) * scaleFactor,
          0,
          0,
          Math.abs(newRect.width) * scaleFactor,
          Math.abs(newRect.height) * scaleFactor,
        )

        // Convert the temporary canvas to a high-quality data URL (base64 encoded image)
        const croppedImage = tempCanvas.toDataURL("image/jpeg", 1.0)

        setBox({
          rectangle: newRect,
          pageNumber,
          url,
          canvasWidth: container.current?.clientWidth,
          canvasHeight: container.current?.clientHeight,
          location: side,
          croppedImage,
        })
        // clean up the rectangles based on the opposite location
        setRectangles((prev) => ({
          ...prev,
          [side === "left" ? "right" : "left"]: [],
        }))
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDrawing || !ctx || !overlay.current) return
        const rect = overlay.current.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        drawAllRectangles(side)

        ctx.beginPath()
        ctx.rect(startX, startY, mouseX - startX, mouseY - startY)
        ctx.strokeStyle = "red"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      overlay.current.addEventListener("mousedown", handleMouseDown)
      overlay.current.addEventListener("mouseup", handleMouseUp)
      overlay.current.addEventListener("mousemove", handleMouseMove)

      return () => {
        overlay.current?.removeEventListener("mousedown", handleMouseDown)
        overlay.current?.removeEventListener("mouseup", handleMouseUp)
        overlay.current?.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("resize", resizeCanvas)
      }
    }

    const cleanupLeft = setupCanvas("left")
    const cleanupRight = setupCanvas("right")

    return () => {
      cleanupLeft?.()
      cleanupRight?.()
    }
  }, [rectangles, pageNumber])

  const resetRectangles = () => setRectangles({ left: [], right: [] })

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[500px] w-4/5 flex-col items-center justify-center rounded-lg bg-gray-100 p-4 shadow-lg">
        <div className="h-2 w-64 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <p className="mt-4 font-medium text-gray-700" dir="rtl">
          جاري تحميل الكتاب... {loadingProgress}%
        </p>
        <div className="mt-2 text-sm text-gray-500">
          يرجى الإنتظار جاري تحميل الكتاب
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-4/5 rounded-lg bg-gray-100 p-4 shadow-lg">
      <div className="flex space-x-4">
        {["left", "right"].map((side) => (
          <div
            key={side}
            className="relative flex-1 overflow-hidden rounded-md bg-gray-100"
            ref={refs[side as "left" | "right"].container}
          >
            <canvas
              ref={refs[side as "left" | "right"].canvas}
              className="h-auto w-full"
            ></canvas>
            <canvas
              ref={refs[side as "left" | "right"].overlay}
              className={`canvas-overlay-${side} absolute left-0 top-0 h-full w-full cursor-crosshair`}
            ></canvas>
          </div>
        ))}
      </div>
      <div className="pdf-controls mt-4 flex items-center justify-center space-x-4">
        <p className="text-gray-700">Page:</p>
        <input
          type="number"
          className="w-24 rounded-md border border-gray-300 bg-white px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={pageNumber}
          aria-label="Page number"
          onChange={(e) => {
            const page = parseInt(e.target.value, 10)
            if (page > 0 && numPages !== null && page <= numPages) {
              setPageNumber(page)
              resetRectangles()
              setBox(null)
            }
          }}
          min={1}
          max={numPages || 1}
        />
        <p className="text-gray-700">of {numPages || 1}</p>
      </div>
    </div>
  )
}

export default PDFViewer
