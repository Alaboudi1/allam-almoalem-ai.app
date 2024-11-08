"use client"

import Allam from '@/components/allam';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
const BooksContent = () => {
  const searchParams = useSearchParams();
  const allam = searchParams.get('allam') as 'male' | 'female';
  const [loading, setLoading] = useState(true);
  const [elementaryBooks, setElementaryBooks] = useState([]);
  const [middleBooks, setMiddleBooks] = useState([]);
  const [highSchoolBooks, setHighSchoolBooks] = useState([]);

  useEffect(() => {
    const fetchElementaryBooks = async () => {
      const response = await fetch(`/api/booklist?level=إبتدائي`);
      const data = await response.json();
      setElementaryBooks(data);
    };

    const fetchMiddleBooks = async () => {
      const response = await fetch(`/api/booklist?level=متوسط`);
      const data = await response.json();
      setMiddleBooks(data);
    };

    const fetchHighSchoolBooks = async () => {
      const response = await fetch(`/api/booklist?level=المشتركة`);
      const data = await response.json();
      setHighSchoolBooks(data);
    };

    Promise.all([
      fetchElementaryBooks(),
      fetchMiddleBooks(),
      fetchHighSchoolBooks()
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="education-stages container mx-auto text-center mt-10 px-4 sm:px-6 lg:px-8" dir="rtl">
      <Allam gender={allam} fixedPosition={null} />
      <h1 className="text-3xl font-bold mb-8 text-center">
        {allam === 'male' ? 'مرحبًا بك مع علام' : 'مرحبًا بك مع علامة'}
      </h1>

      {loading ? (
        <p className="text-center">جاري تحميل الكتب...</p>
      ) : (
        <>
          {/* Primary Stage */}
          <div className="stage mb-16">
            <h2 className="text-3xl font-extrabold mb-8 text-indigo-600">المرحلة الابتدائية</h2>
            {['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'].map((grade, index) => (
              <div key={grade} className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">{`${grade} الابتدائي`}</h3>
                <div className="book-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {
                    // @ts-expect-error elementaryBooks is not an array
                    elementaryBooks[index]?.map((book) => (
                      <Link href={`/interactiveBook?allam=${allam}&book=${book.url}`} key={book.id}>
                        <div className="book-card group">
                          <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                            <Image
                              src={`/images/books/${book.url}.jpg`}
                              alt={book.title}
                              width={200}
                              height={280}
                              className="w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h4 className="text-white text-lg font-semibold">{book.title}</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Middle Stage */}
          <div className="stage mb-16">
            <h2 className="text-3xl font-extrabold mb-8 text-indigo-600">المرحلة المتوسطة</h2>
            {['الأول', 'الثاني', 'الثالث'].map((grade, index) => (
              <div key={grade} className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">{`${grade} المتوسط`}</h3>
                <div className="book-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {
                    // @ts-expect-error middleBooks is not an array
                    middleBooks[index]?.map((book) => (
                      <Link href={`/interactiveBook?allam=${allam}&book=${book.url}`} key={book.id}>
                        <div className="book-card group">
                          <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                            <Image
                              src={`/images/books/${book.url}.jpg`}
                              alt={book.title}
                              width={200}
                              height={280}
                              className="w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h4 className="text-white text-lg font-semibold">{book.title}</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* High School */}
          <div className="stage mb-16">
            <h2 className="text-3xl font-extrabold mb-8 text-indigo-600">الثانوية العامة</h2>
            {[
              "السنة الأولى المشتركة",
              "المسار العام",
              "المسار الشرعي",
              "مسار علوم الحاسب والهندسة",
              "مسار إدارة الأعمال"
            ].map((label, index) => (
              <div key={label} className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">{label}</h3>
                <div className="book-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {
                    // @ts-expect-error highSchoolBooks is not an array
                    highSchoolBooks[index]?.map((book) => (
                      <Link href={`/interactiveBook?allam=${allam}&book=${book.url}`} key={book.id}>
                        <div className="book-card group">
                          <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                            <Image
                              src={`/images/books/${book.url}.jpg`}
                              alt={book.title}
                              width={200}
                              height={280}
                              className="w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h4 className="text-white text-lg font-semibold">{book.title}</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Books = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BooksContent />
    </Suspense>
  );
};

export default Books;
