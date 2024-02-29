import logging
import os
import openai
from dotenv import load_dotenv

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from langchain_openai import ChatOpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_experimental.text_splitter import SemanticChunker
from langsmith import Client

from Model.model import ModelClient
from Model.retriever import RetrieverClient
from DocUploads.uploadToVectorStore import UploadToVectorStoreClient
from OCR.trOcr import process_image
from Model.compare import TextSimilarity
from DocUploads.utils import remove_non_english

load_dotenv()

app = Flask(__name__)
cors = CORS(app)

# Setup Langsmith Client for logging.
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
client = Client()

# Setting up openai credentials.

openai.api_key = os.environ.get("OPENAI_API_KEY")
openai.api_version = "2023-05-15"

# Azure AI Search Settings
vector_store_address: str = os.environ.get("SEARCH_SERVICE")
vector_store_password: str = os.environ.get("AZURE_SEARCH_KEY")
index_name: str = os.environ.get("INDEX_NAME")

# Embedding Model Settings
model_name = "BAAI/bge-small-en"
model_kwargs = {"device": "cpu"}
encode_kwargs = {"normalize_embeddings": True}


# Upload Client
upload_client = UploadToVectorStoreClient(HuggingFaceBgeEmbeddings, model_name, model_kwargs,
                                          encode_kwargs, vector_store_address, vector_store_password, index_name)
# Defining the Vector Store
vector_store = upload_client.get_vector_store()


retriver = RetrieverClient(vector_store=vector_store,
                           llm=ChatOpenAI(temperature=0), weights=[0.5, 0.5])
# RAG model client
model_client = ModelClient(retriever=retriver)

# Similarity client
comparison_client = TextSimilarity(os.environ.get("EMBEDDING_MODEL"))


@app.route("/api/v1/ask_question", methods=["POST"])
def ask():
    question = request.json['question']
    subject = request.json['subject']
    type = request.json["type"]
    if type not in ["General", "Maths", "Coding"]:
        raise Exception("Unknown type")

    try:
        res = model_client.run(question, subject,
                               type, request.json.get("overrides") or {})
        return jsonify(res), 200

    except Exception as e:
        logging.exception("Exception in /ask")
        return jsonify({"error": str(e)}), 500


@app.route("/api/v1/upload_file", methods=["POST"])
def uploadFiles():
    try:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=256,
            chunk_overlap=20,
            length_function=len
        )
        file = request.files["pdf_file"]
        file.save(os.environ.get("FILE_PATH"))
        upload_client.upload_to_vectorStore(
            os.environ.get("FILE_PATH"), text_splitter, False)
        return "File uploaded successfully", 200

    except:
        return "No file uploaded or could not parse", 400
    finally:
        os.remove(os.environ.get("FILE_PATH"))


@app.route("/api/v1/translate_image", methods=["POST"])
@cross_origin()
def process_image_to_text_and_compare():
    max_marks = int(request.form["marks"])
    model_ans = request.form["answer"]

    try:
        file = request.files["image"].read()
        text = process_image(file)
        marks_obtained = comparison_client.determine_marks(
            max_marks, model_ans, text)
        text = remove_non_english(text)
        chat_completion = openai.chat.completions.create(
            model=os.getenv("GPT_MODEL"),
            messages=[{
                "role": "user", "content": "Rearrange the content using same words in a cohesive manner and correct spelling mistakes: " + text
            }],
            temperature=0.1,
            max_tokens=300)
        text = chat_completion.choices[0].message.content

        response = {"userAnswer": text,
                    "score": marks_obtained,
                    "answer": model_ans}
        return jsonify(response), 200

    except Exception as e:
        logging.exception("Exception in /translate_image")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()
