import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
interface AllamProps {
  gender: 'male' | 'female';
  fixedPosition: { x: number, y: number } | null;
}

const Allam: React.FC<AllamProps> = ({ gender, fixedPosition }) => {
  const [position, setPosition] = useState(fixedPosition);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let lastX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - 100; // Adjust as needed
      const newY = e.clientY - 100;
      setPosition({ x: newX, y: newY });

      // Change offset based on mouse movement for a subtle effect
      if (e.clientX < lastX) {
        setOffset({ x: -5, y: Math.random() * 6 - 3 });
      } else if (e.clientX > lastX) {
        setOffset({ x: 5, y: Math.random() * 6 - 3 });
      }
      lastX = e.clientX;
    };

    if (!fixedPosition) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      // Set to a fixed position when not following the cursor
      setPosition(fixedPosition);
      setOffset({ x: -70, y: 0 })
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [fixedPosition]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      animate={{
        left: position ? position.x + offset.x : 0,
        top: position ? position.y + offset.y : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
    >
      <Image
        src={
          gender === 'male'
            ? '/images/allam-male.jpg'
            : '/images/allam-female.jpg'
        }
        alt={`Allam ${gender}`}
        width={80}
        height={80}
        className="rounded-full"
      />
    </motion.div>
  );
};

export default Allam;