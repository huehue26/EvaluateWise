import logging
import os

import openai
from azure.identity import ClientSecretCredential
from azure.search.documents import SearchClient
from azure.keyvault.secrets import SecretClient

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from Model.model import RetrieveThenReadClient
from dotenv import load_dotenv
from OCR.trOcr import process_image
load_dotenv()
app = Flask(__name__)
CORS(app)
tenant_id = os.getenv("AZURE_TENANT_ID")
client_id = os.getenv("AZURE_CLIENT_ID")
client_secret = os.getenv("AZURE_CLIENT_SECRET")
credential = ClientSecretCredential(
    tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)
secret_client = SecretClient(
    os.getenv("KEYVAULT_URL"), credential=credential)

openai.api_key = os.environ.get("OPENAI_API_KEY")
print(os.environ.get("AZURE_SEARCH_INDEX"))
search_client = SearchClient(
    endpoint=os.environ.get("SEARCH_SERVICE"),
    index_name=os.environ.get("AZURE_SEARCH_INDEX"),
    credential=credential
)
model_client = RetrieveThenReadClient(
    search_client, os.environ.get("GPT_MODEL"))


def ask(question, answer, max_marks=2):
    try:
        run = model_client.run(question, answer, max_marks,
                               request.form.get("overrides") or {})
        return jsonify(run), 200
    except Exception as e:
        logging.exception("Exception in /ask")
        return jsonify({"error": str(e)}), 500


@app.route("/translate_image", methods=["POST"])
def process_image_to_text():
    print(request)
    try:
        file = request.files['image'].read()
        question = request.form['question']
        text = process_image(file)
        print(text)
        return ask(question, text)
    except Exception as e:
        logging.exception("Exception in /translate_image")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()
