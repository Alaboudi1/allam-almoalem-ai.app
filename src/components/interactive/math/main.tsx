import React from 'react';

interface PickTeachingMethodsProps {
    onClick: (id: string) => void;
    options: string[];
}

const PickTeachingMethods: React.FC<PickTeachingMethodsProps> = ({ onClick, options }) => {
    const localOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.id;
        onClick(id);
    };

    return (
        <div className='flex flex-col items-center justify-center space-y-8 p-8 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-lg shadow-lg'>
            <h2 className='text-3xl font-bold text-gray-800 animate-fade-in-down'>
                اختر ما تريد
            </h2>
            <div className='flex flex-row items-center justify-center space-x-6 rtl:space-x-reverse'>
                {options.includes("حل تفاعلي") && (
                    <button
                        id='solve'
                        onClick={localOnClick}
                        className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg'
                    >
                        حل تفاعلي
                    </button>
                )}
                {options.includes("اشرح لي") && (
                    <button
                        id='explain'
                        onClick={localOnClick}
                        className='bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg'
                    >
                        اشرح لي
                    </button>
                )}
            </div>
        </div>
    );
};

export default PickTeachingMethods;
