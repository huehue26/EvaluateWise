from langchain_community.document_loaders import PyPDFLoader

import os
import re
from dotenv import load_dotenv
load_dotenv()


class Utils:
    @staticmethod
    def load_PDF_file(pdf_file: str, extract_images: bool = False) -> list[object]:
        """
        Convert PDF file into text using PyPDF Loader.

        Parameters:
        -------------
        pdf_file: Path to PDF file to be loaded
        extract_images: Whether to extract images or not, increases time to load.

        Returns:
        ------------
        List of Document objects.
        """

        loader = PyPDFLoader(file_path=pdf_file, extract_images=extract_images)
        return loader.load()


def preprocess_text(text: str) -> str:
    """
    Helper function to pre-process the text.

    Parameters:
    -------------
    text: The string to be processed.

    Returns:
    ---------
    Processed string of text
    """

    text = stopword_removal(text)
    return remove_non_english(text)


def stopword_removal(text: str) -> str:
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
    with open(os.environ.get("STOPWORDS_PATH"), 'r') as f:
        for word in f:
            word = word.split('\n')
            stopwords.append(word[0])

    tokens = [word for word in text.lower().split(
        " ") if word not in stopwords]

    return " ".join(tokens)


def remove_non_english(text: str) -> str:
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
