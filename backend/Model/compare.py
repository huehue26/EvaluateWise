import openai
import numpy as np
from numpy.linalg import norm
import math
from DocUploads.utils import preprocess_text


def get_embedding(text, model):
    text = text.replace("\n", " ")
    text = preprocess_text(text)
    return openai.Embedding.create(input=[text], model=model)['data'][0]['embedding']


class TextSimilarity():
    def __init__(self, embedding_model) -> None:
        self.embedding_model = embedding_model

    def compare(self, gpt_generated_ans: str, user_ans: str):
        gpt_generated_ans_embedding = get_embedding(
            gpt_generated_ans, self.embedding_model)
        user_ans_embedding = get_embedding(user_ans, self.embedding_model)

        return np.dot(gpt_generated_ans_embedding, user_ans_embedding)/(norm(gpt_generated_ans_embedding)*norm(user_ans_embedding))

    def determine_marks(self, max_marks: int, gpt_generated_ans: str, user_ans: str):
        similarity = self.compare(gpt_generated_ans, user_ans)
        print(similarity)
        return round(max(0, similarity*max_marks)) if similarity > 0.74 else 0
