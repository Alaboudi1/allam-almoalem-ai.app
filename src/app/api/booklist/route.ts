import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET(request: NextRequest) {
  const booksDirectory = path.join(process.cwd(), 'public', 'books');
  const level = request.nextUrl.searchParams.get('level') || '';

  try {
    const files = await fs.promises.readdir(booksDirectory);
    const filteredFiles = files.filter(file => file.includes(level));
    filteredFiles.sort((a, b) => a.localeCompare(b));
    const books = await Promise.all(filteredFiles.map(async folder => {
      // Read the content of each grade folder
      const folderPath = path.join(booksDirectory, folder);


      // Filter for PDF files and map them to book objects
      const txtFile = path.join(folderPath, `foldername.txt`);
      const fileContent = await fs.promises.readFile(txtFile, 'utf8');
      const fileNames = fileContent.split('\n').filter(name => name.trim());

      return fileNames.map(fileName => {
        return {
          id: fileName,
          title: folder.replace(/_/g, ' '),
          grade: folder,
          url: `${folder}/${fileName.replace('.pdf', '')}`
        };
      });
    }));

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error reading books directory:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}


