from typing import Any
import openai
from azure.search.documents.aio import SearchClient
from azure.search.documents.models import QueryType


def nonewlines(s: str) -> str:
    return s.replace("\n", " ").replace("\r", " ")


class RetrieveThenReadClient():
    """
    Simple retrieve-then-read implementation, using the Cognitive Search and OpenAI APIs directly. It first retrieves
    top documents from search, then constructs a prompt with them, and then uses OpenAI to generate an completion
    (answer) with that prompt.
    """
    template = \
        "Answer the following question as precisely as possible given the content as the source." + \
        """
        question = {q}? keeping in mind that subject is {subject} and it is a {type} answer
        content = {content}
        """

    def __init__(
        self,
        search_client: SearchClient,
        openai_deployment: str,
    ):
        self.search_client = search_client
        self.openai_deployment = openai_deployment

    def run(self, query: str, subject: str, type: str, overrides: dict[str, Any]) -> dict[str, Any]:
        """
        Run the model inference to get results back.

        Parameters:
        -----------
        query: The query to be processed.
        subject: The subject to which the query belongs (English,hindi, maths)

        type: The type of question (Short answer,long answer,coding)
        overrides: Any kind of optional parameter for AI Search.

        Returns:
        sources: The source from which the results were derived.
        answer: The model generated answer to the query.
        """

        # If semantic captions on, use hit highlighting
        use_semantic_captions = True if overrides.get(
            "semantic_captions") else False
        top = overrides.get("top", 3)

        # Use semantic ranker if requested and if retrieval mode is text or hybrid (vectors + text)
        if overrides.get("semantic_ranker"):
            r = self.search_client.search(
                query,
                filter=filter,
                query_type=QueryType.SEMANTIC,
                query_language="en-us",
                query_speller="lexicon",
                semantic_configuration_name="default",
                top=3,
                query_caption="extractive|highlight-false" if use_semantic_captions else None,
            )
        else:
            r = self.search_client.search(
                query,
                top=3,
            )
        self.results = []
        self.result_sources = set()

        if use_semantic_captions:
            self.results = [nonewlines(
                " . ".join([c.text for c in doc['@search.captions']])) for doc in r]

        else:
            for doc in r:
                self.results.append(doc["content"][:256])
                self.result_sources.add(doc["source"])

        result_sources = ",".join(list(self.result_sources))
        content = "\n".join(self.results)

        # Add the necessary params to the prompt template
        prompt = self.template.format(
            q=query, subject=subject, type=type, content=content)

        # Generate the completion to derive the answer for the query.
        chat_completion = openai.ChatCompletion.create(
            model=self.openai_deployment,
            messages=[{
                "role": "user", "content": prompt
            }],
            temperature=overrides.get("temperature") or 0.3,
            max_tokens=300,
        )

        return {
            "sources": result_sources,
            "answer": chat_completion.choices[0].message.content,
        }
