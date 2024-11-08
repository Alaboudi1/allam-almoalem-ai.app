import os
from pdf2image import convert_from_path

def extract_first_page_images():
    # Directory paths
    pdf_dir = 'public/books'
    output_dir = 'public/images/books'

    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Iterate through PDF files in the books directory
    for pdfFolder in os.listdir(pdf_dir):
        # check if the folder is a directory
        if os.path.isdir(os.path.join(pdf_dir, pdfFolder)):
            # create the output folder if it doesn't exist
            if not os.path.exists(os.path.join(output_dir, pdfFolder)):
                os.makedirs(os.path.join(output_dir, pdfFolder))
            for filename in os.listdir(os.path.join(pdf_dir, pdfFolder)):   
                if filename.endswith('.pdf'):
                    pdf_path = os.path.join(pdf_dir, pdfFolder, filename)
            
                # Convert first page of PDF to image
                images = convert_from_path(pdf_path, first_page=1, last_page=1)
                
                if images:
                    # Save the first (and only) image
                    image = images[0]
                    image_filename = f"{os.path.splitext(filename)[0]}.jpg"
                    image_path = os.path.join(output_dir, pdfFolder, image_filename)
                    image.save(image_path, 'JPEG')
                    print(f"Saved image for {filename}")
                else:
                    print(f"Could not extract image from {filename}")

if __name__ == "__main__":
    extract_first_page_images()



# https://storage.cloud.google.com/books-allam/books/1%20%D9%85%D8%AA%D9%88%D8%B3%D8%B7%20%D8%A7%D9%84%D8%A3%D9%88%D9%84/60a12c20-GE-ME-K07-SM1-TFML.pdf