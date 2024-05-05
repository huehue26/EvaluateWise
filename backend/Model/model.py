from typing import Any
import os
from dotenv import load_dotenv

from langchain.prompts import PromptTemplate
from langchain.schema.document import Document
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.retrievers import BaseRetriever

load_dotenv()


def nonewlines(s: str) -> str:
    return s.replace("\n", " ").replace("\r", " ")


class ModelClient():

    def __init__(
        self,
        retriever: BaseRetriever,
    ) -> None:
        self.retriever = retriever

    @staticmethod
    def build_first_pass() -> PromptTemplate:
        """
        Builds the first pass of the Tree of thought model.

        Parameters:
        ------------
        None

        Returns:
        -----------
        A prompt template containing the tree of thoughts prompt.
        """

        template = """
        You are a helpful AI Q&A agent. Given the question: {question}, answer it using the given context: {context}. If context is unhelpful, respond on your own if you know the answer.
        A:
        """
        prompt = PromptTemplate(
            input_variables=["question", "context"], template=template)
        return prompt

    @staticmethod
    def build_second_pass() -> PromptTemplate:
        """
        Builds the second pass of the Tree of thought model.

        Parameters:
        ------------
        None

        Returns:
        -----------
        A prompt template containing the tree of thoughts prompt.
        """
        template = """
        Implement and provide a final answer given the steps to perform: {answers}
        A:
        """
        prompt = PromptTemplate(
            input_variables=["question", "answers"],
            template=template
        )
        return prompt

    @staticmethod
    def content_extractor(docs: list[Document]) -> list[str]:
        """
        Extracts the page content from the retrieved results.

        Parameters:
        ------------
        docs: List of Documents retrieved by the retriever.

        Returns:
        ------------
        The extracted content from the results.
        """

        return list(map(lambda x: x.page_content, docs))

    @staticmethod
    def retrieve_required_model(question_type: str, temperature: float = 0.3) -> object:
        """
        Selects which model is to be used depending on the question.

        Parameters: 
        ------------
        question_type: Type of question asked. Can be one of ['General','Maths','Coding'].
        temperature:  Temperature setting of the model to be used.

        Returns:
        ------------
        A Completion Model to return.
        """

        if question_type == "General":
            return ChatOpenAI(temperature=temperature, model="gpt-3.5-turbo")
        if question_type == "Maths":
            return ChatOpenAI(temperature=0.1, model="gpt-4")
        if question_type == "Coding":
            return ChatOpenAI(temperature=temperature)

    def run(self, query: str, subject: str, question_type: str, marks: int, overrides: dict[str, Any]) -> dict[str, Any]:
        """
        Returns the result of user query after evaluating it through the RAG pipeline. 

        Parameters:
        -------------
        query: A string denoting the question user asked.
        subject: The subject to which the question is related.
        question_type: Type of question asked. Can be one of ['General','Maths','Coding'].
        overrides: A dictionary denoting other optional parameters.

        Returns:
        ------------
        A dictionary of values denoting the model result.
        """
        marks_vs_words = ["20 words", "40 words",
                          "70 words", "100 words", "150 words"]

        query = query + " " + marks_vs_words[marks-1]

        # Fetch the required model
        model = self.retrieve_required_model(
            question_type=question_type, temperature=overrides.get("temperature") or 0.3)

        # Chain to parse model output.
        model_parser = model | StrOutputParser()

        # Chain responsible for runnning the RAG pipeline.
        chain = ({"context": self.retriever.return_retriever() | RunnableLambda(self.content_extractor), "question": RunnablePassthrough(
        )} | self.build_first_pass() | {"answer": model_parser})

        answer = chain.invoke(query)
        return answer
