"use client";
import Allam from '@/components/allam';
import PDFViewer from "@/components/PDFViewer";
import TextBubble from '@/components/textBubble';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import BubbleContent from './bubbleContent';

export default function InteractiveBook() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InteractiveBookContent />
    </Suspense>
  );
}

function InteractiveBookContent() {
  const searchParams = useSearchParams()
  const allam = searchParams.get('allam') as 'male' | 'female'
  const book = searchParams.get('book')
  const [fixedPosition, setFixedPosition] = useState<{ x: number, y: number } | null>(null)
  const [category, setCategory] = useState("")
  const [textContent, setTextContent] = useState("")
  const [extractedText, setExtractedText] = useState<{ content: string, isMath: boolean, isArabic: boolean, isQuestion: boolean, visualDescription: string }>({ content: "", isMath: false, isArabic: false, isQuestion: false, visualDescription: "" })
  const pageLocation = useRef('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  const extractTextFromBox = async (box: any) => {
    try {
      const response = await fetch("/api/textProcessing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(box),
      });

      if (!response.ok) {
        return {}
      }

      const { extractedText } = await response.json();
      return extractedText;
    } catch (error) {
      console.error("Error extracting text:", error);
      throw new Error("Failed to extract text from box");
    }
  }

  const askAllam = async (question: any, type: string) => {
    const { allamResponse } = await fetch("/api/allam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, type }),
    }).then((res) => res.json())
    return allamResponse.replace(/\|\/stop\|/g, "")
  }

  const playTTS = async (text: string) => {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice: allam === 'male' ? 'Suleiman' : 'Amina' }),
    });
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    }
  };

  const stt = async (audioBlob: FormData) => {
    const { text } = await fetch("/api/stt", {
      method: "POST",
      body: audioBlob,
    }).then((res) => res.json())
    return text
  }

  const setBox = async (box: any) => {
    setTextContent("")
    if (box === null) {
      setFixedPosition(null)
      return
    }
    let x = box.rectangle.x
    let y = box.rectangle.y
    if (box.location === "right") {
      x = x + box.canvasWidth
    }
    setFixedPosition({ x, y })
    pageLocation.current = box.location
    setCategory("wait")
    const extractedText = await extractTextFromBox(box);
    setExtractedText(extractedText)

  }

  useEffect(() => {
    const { isQuestion, content } = extractedText;
    if (content === undefined) {
      closeBubble()
      return
    }
    setCategory(isQuestion ? "QuestionExplain" : "ExplainOnly")

  }, [extractedText])

  const handleClick = async (e: string | FormData) => {
    const x = pageLocation.current === "right" ? window.innerWidth * 0.05 : window.innerWidth * 0.51
    // top position
    const y = window.innerHeight * 0.1
    const { content, isMath, isArabic, isQuestion, visualDescription } = extractedText;

    // Determine appropriate prompt category based on content type
    let promptCategory = "";
    if (isMath) {
      if (isQuestion) {
        promptCategory = isArabic ? "MathArabicQuestion" : "MathEnglishQuestion";
      } else {
        promptCategory = isArabic ? "MathArabic" : "MathEnglishExplain";
      }
    } else {
      promptCategory = isArabic ? "ArabicExplain" : "EnglishExplain";
    }

    if (e === "explain") {
      setFixedPosition({ x, y })
      setCategory("wait")

      const allamResponse = await askAllam(content, promptCategory)
      playTTS(allamResponse)
      const htmlResponse = await askAllam(`${content} \n ${visualDescription}`, "html-explain")
      setTextContent(htmlResponse)
      setCategory(e)
    }

    if (e === "solve") {
      setFixedPosition({ x, y })
      setCategory("wait")
      const allamResponse = await askAllam(content, promptCategory)
      const htmlResponse = await askAllam(`${content} \n ${visualDescription}`, "html-solve")
      setTextContent(htmlResponse)
      playTTS(allamResponse)
      setCategory(e)
    }

    if (e === "read") {
      setFixedPosition({ x, y })
      setCategory("wait")
      playTTS(content)
    }

    if (e instanceof FormData) {
      setFixedPosition({ x, y })
      setCategory("wait")
      const answer = await stt(e)
      const checkResponse = await askAllam(`
        المسألة:
        ${content}
        الإجابة التي قدمها الطالب:
        ${answer}
        `, "MathSolveCheck")
      const htmlResponse = await askAllam(checkResponse, "html-explain")
      setCategory("explain")
      setTextContent(htmlResponse)
      playTTS(checkResponse)
    }
  }

  const closeBubble = () => {
    setBox(null)
    setFixedPosition(null)
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  return (
    <main>
      <Allam gender={allam} fixedPosition={fixedPosition} />
      {fixedPosition && <TextBubble position={fixedPosition}>
        <BubbleContent category={category} text={textContent} onClick={handleClick} />
        <button
          onClick={closeBubble}
          className='absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50'
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </TextBubble>
      }
      <PDFViewer url={`books/${book}.pdf`} setBox={setBox} />
    </main>
  );
}
