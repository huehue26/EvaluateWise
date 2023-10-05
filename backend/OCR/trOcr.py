from google.cloud import vision


def process_image(content):
    """Detects text in the file."""

    client = vision.ImageAnnotatorClient()

    image = vision.Image(content=content)

    response = client.text_detection(image=image)
    texts = response.text_annotations
    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(
                response.error.message)
        )
    extracted_text = "\n".join([text.description for text in texts])
    extracted_text = ''.join(
        letter if letter.isalnum() else " " for letter in extracted_text)
    return extracted_text


if __name__ == "__main__":
    with open(r"C:\Users\krish\OneDrive\Desktop\Coding Stuff\BTP\test.jpg", "rb") as f:
        content = f.read()
    print(process_image(content))
