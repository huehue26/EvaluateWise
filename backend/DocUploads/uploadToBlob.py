from dotenv import load_dotenv
import os

from azure.keyvault.secrets import SecretClient
from azure.identity import ClientSecretCredential
from azure.storage.blob import BlobServiceClient

from DocUploads.utils import Utils

load_dotenv()

# Credentials for authenticating to Azure Blob Client
tenant_id = os.getenv("AZURE_TENANT_ID")
client_id = os.getenv("AZURE_CLIENT_ID")
client_secret = os.getenv("AZURE_CLIENT_SECRET")

credential = ClientSecretCredential(
    tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)


class UploadToBlobClient:
    def __init__(self):
        """
        Client to chunk a PDF file and upload it to Blob Storage for processing.
        """

        # Keyvault client to get secrets like Connection String.
        secret_client = SecretClient(
            os.getenv("KEYVAULT_URL"), credential=credential)

        self.blob_service_client = BlobServiceClient.from_connection_string(
            secret_client.get_secret(os.getenv("CONNECTION_STRING_SECRET")).value)

    def upload_to_storage(self, pdf_file: object, title: str, subject: str):
        """
        Upload the chunked PDF file to blob storgae as JSON lines.

        Parameters:
        -----------
        pdf_file: The read content from the PDF file
        title: The title of the file.
        subject: The subject the file belongs to.

        Returns:
        ---------
        None
        """
        chunks = Utils.convert_PDF_to_text(
            pdf_file, title, int(os.environ.get("CHUNK_SIZE")))
        try:
            self.blob_client = self.blob_service_client.get_blob_client(
                os.getenv("CONTAINER_NAME"), title+subject)
        except:
            print("Same blob exists already.")
        print(f"Uploading chunks to the blob storage")

        self.blob_client.upload_blob(
            chunks, blob_type="BlockBlob")
