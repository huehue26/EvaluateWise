from langchain_core.embeddings import Embeddings
from langchain.schema.document import Document
from langchain_community.vectorstores.azuresearch import AzureSearch
from langchain_community.vectorstores import VectorStore

from DocUploads.utils import Utils


class UploadToVectorStoreClient:
    def __init__(self, model: Embeddings, embedding_model_name: str, embedding_model_kwargs: str, embedding_model_encoder_kwargs: str, azure_search_endpoint: str, azure_search_key: str, index_name: str, fields: list[object] = None):
        """
        Client to chunk a PDF file and upload it to the vector store.
        """

        self.model_name = embedding_model_name
        self.model_kwargs = embedding_model_kwargs
        self.encode_kwargs = embedding_model_encoder_kwargs
        self.model: Embeddings = model(model_name=self.model_name,
                                       model_kwargs=self.model_kwargs, encode_kwargs=self.encode_kwargs)
        self.vector_store: AzureSearch = AzureSearch(
            azure_search_endpoint=azure_search_endpoint, azure_search_key=azure_search_key, index_name=index_name, embedding_function=self.model.embed_query, fields=fields
        )

    def get_vector_store(self) -> VectorStore:
        """
        Returns the instantiated vector store.

        Parameters:
        -----------
        None

        Returns:
        ---------
        A VectorStore object

        """
        return self.vector_store

    def chunk_documents(self, docs: list[Document], splitting_method: object) -> list[Document]:
        """
        Split documents into multiple chunks using appropriate chunking strategy

        Parameters:
        -----------
        docs: A list of LangChain Documents retrieved after parsing the PDF file.
        splitting_method: Technique used to split document into chunks.

        Returns:
        ----------
        A list of chunked Documents.
        """

        # Convert Documents to only their page content
        pages = list(map(lambda x: x.page_content, docs))

        text_splitter = splitting_method
        chunks = text_splitter.create_documents(pages)
        return chunks

    def upload_to_vectorStore(self, pdf_file: str, splitting_method: object, extract_images: bool = False) -> VectorStore:
        """
        Upload the chunked PDF file to vector store

        Parameters:
        -----------
        pdf_file: The path to the PDF file.
        splitting_method: Technique used to split document into chunks.
        extract_images: Whether to extract images or not, increases time to load.

        Returns:
        ---------
        vector_store = The initialized vector store.
        """

        docs = Utils.load_PDF_file(
            pdf_file, extract_images)
        chunks = self.chunk_documents(
            docs=docs, splitting_method=splitting_method)

        try:
            self.vector_store.add_documents(documents=chunks)
            return self.vector_store
        except Exception as e:
            print("Something went wrong: ", e)
