import React, { useEffect, useRef, useState } from 'react';

interface SolveProps {
    text: string;
    onClick: (text: FormData) => void;
}

const Solve: React.FC<SolveProps> = ({ text, onClick }) => {
    const [displayedText, setDisplayedText] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const htmlTags = text.match(/<[^>]*>|[^<]+/g) || [];
        let index = 0;
        const interval = setInterval(() => {
            if (index < htmlTags.length) {
                setDisplayedText(prevText => [...prevText, htmlTags[index]]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 50); // Adjust the speed of typing effect here

        return () => clearInterval(interval);
    }, [text]);

    const startRecording = () => {
        if (isRecording) {
            // If already recording, stop the recording
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
            }
            setIsRecording(false);
        } else {
            setIsRecording(true);
            setAudioBlob(null);
            setAudioUrl(null);
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorderRef.current = mediaRecorder;
                    const audioChunks: BlobPart[] = [];

                    mediaRecorder.addEventListener("dataavailable", event => {
                        audioChunks.push(event.data);
                    });

                    mediaRecorder.addEventListener("stop", () => {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                        setAudioBlob(audioBlob);
                        setAudioUrl(URL.createObjectURL(audioBlob));
                        setIsRecording(false);
                    });

                    mediaRecorder.start();
                });
        }
    };

    const handleSubmit = () => {
        if (audioBlob) {
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.webm');
            onClick(formData);
        }
    };

    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    return (
        <div className='flex flex-col items-center justify-center space-y-8 p-8 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-lg shadow-lg' style={{ transition: 'all 0.3s ease' }}>
            <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: displayedText.join('') }} style={{ width: '90%', height: '90%', transition: 'all 0.3s ease' }} />
            <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                <button
                    onClick={startRecording}
                    className={`flex items-center px-4 py-2 rounded-full ${isRecording ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'} transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg`}
                >
                    {isRecording ? (
                        <>
                            <span className="mr-2">جاري التسجيل...</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                                <circle cx="10" cy="10" r="8" />
                            </svg>
                        </>
                    ) : (
                        <>
                            <span className="mr-2">تسجيل الإجابة</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                            </svg>
                        </>
                    )}
                </button>
                {audioUrl && (
                    <>
                        <button
                            onClick={playAudio}
                            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-full transition duration-300 ease-in-out hover:bg-yellow-600 transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            <span className="mr-2">استماع</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-full transition duration-300 ease-in-out hover:bg-green-600 transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            <span className="mr-2">إرسال</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
            {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" />}
        </div>
    );
};

export default Solve;
