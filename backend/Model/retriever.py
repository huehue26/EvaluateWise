from langchain_core.retrievers import BaseRetriever
from langchain.retrievers.ensemble import EnsembleRetriever
from langchain_community.vectorstores import VectorStore
from langchain.retrievers.multi_query import MultiQueryRetriever
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor


def get_multi_query_retriever(llm: object, vector_store: VectorStore) -> MultiQueryRetriever:
    """
    Returns an instantiated MultiQuery Retriever

    Parameters:
    ------------
    llm: The LLM to be used for the retriever.
    vector_store: The vector store from which documents are to be retrieved.

    Returns:
    ---------
    A MultiQueryRetriever object.
    """

    return MultiQueryRetriever.from_llm(retriever=vector_store.as_retriever(), llm=llm)


def get_contextual_compression_retriever(llm: object, vector_store: VectorStore) -> ContextualCompressionRetriever:
    """
    Returns an instantiated Contextual Compression Retriever

    Parameters:
    ------------
    llm: The LLM to be used for the retriever.
    vector_store: The vector store from which documents are to be retrieved.

    Returns:
    ---------
    A Contextual Compression Retriever object.
    """

    compressor = LLMChainExtractor.from_llm(llm)
    compression_retriever = ContextualCompressionRetriever(
        base_compressor=compressor, base_retriever=vector_store.as_retriever())
    return compression_retriever


class RetrieverClient:
    """Class to instantiate a new Ensemble Retriever"""

    def __init__(self, vector_store: VectorStore, llm: object, weights: list[float]) -> None:
        multiquery_retriever: MultiQueryRetriever = get_multi_query_retriever(
            llm, vector_store)
        contextual_compression_retriever: ContextualCompressionRetriever = get_contextual_compression_retriever(
            llm, vector_store)
        self.retriever: BaseRetriever = EnsembleRetriever(
            retrievers=[multiquery_retriever, contextual_compression_retriever], weights=weights)

    def return_retriever(self) -> EnsembleRetriever:
        """
        Returns the instantiated ensemble retriever
        """

        return self.retriever
