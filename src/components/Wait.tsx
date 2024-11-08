import React from 'react';

const Wait: React.FC = () => {
    return (
        <div className='flex flex-col items-center justify-center space-y-8 p-8 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-lg shadow-lg' >
            <h2 className='text-3xl font-bold text-gray-800 animate-pulse' >
                جاري التفكير...
            </h2>
            <div className='flex'>
                <div className='w-4 h-4 bg-blue-500 rounded-full animate-[ping_1s_ease-in-out_infinite] transition-all duration-500 mx-1 hover:scale-150 hover:rotate-180' />
                <div className='w-4 h-4 bg-green-500 rounded-full animate-[ping_1s_ease-in-out_infinite_100ms] transition-all duration-500 mx-1 hover:scale-150 hover:rotate-180' />
                <div className='w-4 h-4 bg-purple-500 rounded-full animate-[ping_1s_ease-in-out_infinite_200ms] transition-all duration-500 mx-1 hover:scale-150 hover:rotate-180' />
                <div className='w-4 h-4 bg-blue-500 rounded-full animate-[ping_1s_ease-in-out_infinite_300ms] transition-all duration-500 mx-1 hover:scale-150 hover:rotate-180' />
                <div className='w-4 h-4 bg-green-500 rounded-full animate-[ping_1s_ease-in-out_infinite_400ms] transition-all duration-500 mx-1 hover:scale-150 hover:rotate-180' />
                <div className='w-4 h-4 bg-purple-500 rounded-full animate-[ping_1s_ease-in-out_infinite_500ms] transition-all duration-500 mx-1 hover:scale-150 hover:rotate-180' />
            </div>
        </div>
    );
};

export default Wait;
