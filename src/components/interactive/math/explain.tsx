import React, { useEffect, useState } from 'react';

interface ExplainProps {
    text: string;
}

const Explain: React.FC<ExplainProps> = ({ text }) => {
    const [displayedText, setDisplayedText] = useState<string[]>([]);

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

    return (
        <div className='flex flex-col items-center justify-center space-y-8 p-8 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-lg shadow-lg' style={{ transition: 'all 0.3s ease' }}>
            <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: displayedText.join('') }} style={{ width: '90%', height: '90%', transition: 'all 0.3s ease' }} />
        </div>
    );
};

export default Explain;
