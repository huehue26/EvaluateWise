from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfparser import PDFParser

import json
from io import StringIO
import re


class Utils:
    @staticmethod
    def convert_PDF_to_text(pdf_file: object, title: str, chunk_size=256):
        """
        Convert PDF file into text.

        Parameters:
        -------------
        pdf_file: pdf file content read as a byte string
        chunk_size: number of characters in each chunk

        Returns:
        ------------
        Chunks of text in json objects
        """
        output_string = StringIO()  # Where result will be stored

        parser = PDFParser(pdf_file)  # Parser for parsing the given PDF file.
        doc = PDFDocument(parser)

        rsrmgr = PDFResourceManager()
        # Convert PDF doc into strings of text.
        device = TextConverter(rsrmgr, output_string, laparams=LAParams())

        # Interpret the text contained in the file.
        interpreter = PDFPageInterpreter(rsrmgr, device)

        for page in PDFPage.create_pages(doc):
            interpreter.process_page(page)
        text = output_string.getvalue()

        chunks = []

        for i in range(0, len(text), chunk_size):
            chunks.append(
                {"content": text[i:i+chunk_size], "source": title})
        chunk_lines = "\n".join(json.dumps(chunk) for chunk in chunks)
        return chunk_lines


def preprocess_text(text: str):
    """
    Helper function to pre-process the text.

    Parameters:
    -------------
    text: The string to be processed.

    Returns:
    ---------
    Processed string of text
    """

    text = remove_stopword_removal(text)
    return remove_non_english(text)


def remove_stopword_removal(text: str):
    """
    Remove stopwords like a/an/the from the text

    Parameters:
    ------------
    text: The text string with stopwords

    Returns:
    ---------
    String with stopwords removed.
    """

    # Create a list of stopword tokens.
    stopwords = []
    with open(r'C:\Users\krish\OneDrive\Desktop\Coding Stuff\BTP\EvaluateWise\backend\DocUploads\stopWords.txt', 'r') as f:
        for word in f:
            word = word.split('\n')
            stopwords.append(word[0])

    tokens = [word for word in text.lower().split(
        " ") if word not in stopwords]

    return " ".join(tokens)


def remove_non_english(text: str):
    """
    Remove non-english characters from the string.

    Parameters:
    -------------
    text: The normal text string.

    Returns:
    ---------
    Processed string with no non-english characters
    """
    string_list = text.split(" ")
    result = [i for i in string_list if not re.findall(
        "[^\u0000-\u05C0\u2100-\u214F]+", i)]
    return " ".join(result)
