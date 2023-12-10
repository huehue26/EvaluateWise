import logging
import os

import openai
from azure.identity import ClientSecretCredential
from azure.search.documents import SearchClient
from azure.keyvault.secrets import SecretClient
from azure.core.credentials import AzureKeyCredential

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from Model.model import RetrieveThenReadClient
from dotenv import load_dotenv

from OCR.trOcr import process_image
from Model.compare import TextSimilarity
from DocUploads.uploadToBlob import UploadToBlobClient
from DocUploads.utils import remove_non_english

load_dotenv()

app = Flask(__name__)
cors = CORS(app)
# Credentials for Azure Autentication.
tenant_id = os.getenv("AZURE_TENANT_ID")
client_id = os.getenv("AZURE_CLIENT_ID")
client_secret = os.getenv("AZURE_CLIENT_SECRET")

credential = ClientSecretCredential(
    tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)

secret_client = SecretClient(
    os.getenv("KEYVAULT_URL"), credential=credential)

# Setting up openai credentials.

openai.api_key = os.environ.get("OPENAI_API_KEY")

# Azure AI Search Client
search_client = SearchClient(
    endpoint=os.environ.get("SEARCH_SERVICE"),
    index_name=os.environ.get("AZURE_SEARCH_INDEX"),
    credential=AzureKeyCredential(os.getenv("AZURE_SEARCH_KEY"))
)

# RAG model client
model_client = RetrieveThenReadClient(
    search_client, os.environ.get("GPT_MODEL"))

# Cosine Similarity client
comparison_client = TextSimilarity(os.environ.get("EMBEDDING_MODEL"))

# Azure Blob Storage client
upload_client = UploadToBlobClient()


@app.route("/ask_question", methods=["POST"])
def ask():
    question = request.json['question']
    subject = request.json['subject']
    type = request.json["type"]

    try:
        run = model_client.run(question, subject,
                               type, request.json.get("overrides") or {})
        return jsonify(run), 200

    except Exception as e:
        logging.exception("Exception in /ask")
        return jsonify({"error": str(e)}), 500


@app.route("/upload_file", methods=["POST"])
def uploadFiles():
    if "pdf_file" in request.files:
        file = request.files["pdf_file"]
        subject = request.form["subject"]

        upload_client.upload_to_storage(
            file, file.filename.split(".")[0], subject)
        return "File uploaded successfully", 200

    else:
        return "No file uploaded or could not parse", 400


@app.route("/translate_image", methods=["POST"])
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
        response = {"userAnswer": text,
                    "score": marks_obtained,
                    "answer": model_ans}
        return jsonify(response), 200

    except Exception as e:
        logging.exception("Exception in /translate_image")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()
