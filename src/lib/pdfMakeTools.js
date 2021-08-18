import PdfPrinter from "pdfmake";
import ImageDataURI from "image-data-uri";

const turnToBase64Format = async (url) => {
  const urlBase64 = await ImageDataURI.encodeFromURL(url);
  return urlBase64;
};

export const getBlogPostPDFReadableStream = async (blogPost) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };
  const printer = new PdfPrinter(fonts);
  const base64Image = await turnToBase64Format(blogPost.cover);

  const docDefinition = {
    content: [
      { image: base64Image, width: 510 },
      "\n\n\n",
      {
        text: blogPost.title,
        style: "header",
      },
      "\n\n\n",
      blogPost.content,
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
    },
  };
  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);

  pdfReadableStream.end();
  return pdfReadableStream;
};
