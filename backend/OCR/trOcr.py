from google.cloud import vision
import numpy as np
from PIL import Image as im
from scipy.ndimage import interpolation as inter
import cv2


def find_score(arr, angle):
    data = inter.rotate(arr, angle, reshape=False, order=0)
    hist = np.sum(data, axis=1)
    score = np.sum((hist[1:] - hist[:-1]) ** 2)
    return hist, score


def skew_correction(img):
    """
    Remove noise from the image
    Parameters:
    -----------
    img: the skewed PIL image

    Returns:
    ---------
    img: the skew corrected image

    """

    wd, ht = img.size
    pix = np.array(img.convert('1').getdata(), np.uint8)
    bin_img = 1 - (pix.reshape((ht, wd)) / 255.0)
    delta = 1
    limit = 5
    angles = np.arange(-limit, limit+delta, delta)
    scores = []
    for angle in angles:
        hist, score = find_score(bin_img, angle)
        scores.append(score)
    best_score = max(scores)
    best_angle = angles[scores.index(best_score)]
    # correct skew
    data = inter.rotate(bin_img, best_angle, reshape=False, order=0)
    img = im.fromarray((255 * data).astype("uint8")).convert("RGB")
    return img


def noise_removal(img):
    """
    Remove noise from the image
    Parameters:
    -----------
    img: the noisy PIL image

    Returns:
    ---------
    dst: the denoised image
    """

    img_np = np.array(img)
    img = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
    dst = cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 15)
    return dst


def thinning(img):
    """
    Function to performa skeletonization / thinning on the image

    Parameters:
    ----------
    img: The PIL image to be thinned

    Returns:
    -------
    erosion: the thinned image
    """
    kernel = np.ones((5, 5), np.uint8)
    erosion = cv2.erode(img, kernel, iterations=1)
    return erosion


def process_image(content):
    """
    Detects text in the file.

    Parameters:
    -----------
    content: The image content to process

    Returns:
    --------
    extracted_text : the detected text in the image.

    """

    # Set up the image annotator client (google sdk required)
    client = vision.ImageAnnotatorClient()

    image = vision.Image(content=content)

    # Detect the text present in the image
    response = client.text_detection(image=image)
    texts = response.text_annotations

    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(
                response.error.message)
        )

    description = list(set(text.description for text in texts))
    extracted_text = "\n".join(description)

    return extracted_text
