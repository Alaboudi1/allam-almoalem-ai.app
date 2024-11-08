import { motion } from 'framer-motion';
import React from 'react';

interface TextBubbleProps {
    position: { x: number; y: number };
    children: React.ReactNode;
}

const TextBubble: React.FC<TextBubbleProps> = ({ position, children }) => {
    return (
        <motion.div
            className="text-bubble fixed rounded-2xl shadow-xl overflow-hidden"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: 9999,
                maxWidth: '40%',
                minWidth: '25%',
                minHeight: '10%',
                maxHeight: '70%',
                direction: 'rtl',
            }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.6
            }}
        >
            <div
                className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-1"
            >
                <div
                    className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-4 overflow-y-auto"
                    style={{
                        maxHeight: 'calc(70vh - 2rem)',
                        boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
                    }}
                >
                    {children}
                </div>
            </div>
        </motion.div>
    );
};

export default TextBubble;
