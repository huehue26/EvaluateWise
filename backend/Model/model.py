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
        "Answer the following question= as precisely as possible" + \
        """
        {q}?
        """

    def __init__(
        self,
        search_client: SearchClient,
        openai_deployment: str,
    ):
        self.search_client = search_client
        self.openai_deployment = openai_deployment

    def compare(self, gpt_generated_ans: str, user_ans: str, max_marks: int):
        prompt = f" Given a model answer {gpt_generated_ans} and a user answer {user_ans} rate the answer based on a score out of {max_marks} on the basis of how close it is to the model answer."
        completion = openai.ChatCompletion.create(
            model=self.openai_deployment,
            messages=[
                {"role": "system", "content": "Only return a single integer"},
                {"role": "user", "content": prompt,
                 }],
            temperature=0,
            max_tokens=32
        )
        return completion.choices[0].message.content

    def run(self, query: str, answer_str: str, max_marks: int, overrides: dict[str, Any]) -> dict[str, Any]:
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
                top=top,
                query_caption="extractive|highlight-false" if use_semantic_captions else None,
            )
        else:
            r = self.search_client.search(
                query
            )
        # if use_semantic_captions:
        #     self.results = [nonewlines(
        #         " . ".join([c.text for c in doc['@search.captions']])) for doc in r]
        # else:
        #     self.results = [
        #         nonewlines(doc["content"][:500]) for doc in r]

        self.results = ""
        content = "\n".join(self.results)

        prompt = self.template.format(q=query)
        chat_completion = openai.ChatCompletion.create(
            model=self.openai_deployment,
            messages=[{
                "role": "user", "content": query
            }],
            temperature=overrides.get("temperature") or 0.3,
            max_tokens=200,
        )

        marks = self.compare(
            chat_completion.choices[0].message.content, answer_str, max_marks)

        return {
            "data_points": self.results,
            "answer": chat_completion.choices[0].message.content,
            "marks": marks
        }
