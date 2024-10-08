# Setting Up the Project

## Initial Setup

We need to set up various environment variables to run this project. A step-by-step explanation is given for setting them up for the project. Follow these steps after cloning the repository to your local storage.

1. Setup a MongoDB cluster for the persistence of data in the Next.js app. Steps for setting up the cluster are given [here](https://www.mongodb.com/docs/atlas/getting-started/). Once set up, copy the URI string and paste in _client/.env.local_ file as the property **NEXT_PUBLIC_MONGODB_URI**
2. Setup the **API_URL** in the _.env.local_ file as the URL of your backend Flask App.
3. We use a lot of Azure resources for this project. Set up a student tier account for Azure by following the steps given [here](https://azure.microsoft.com/en-in/free/students).
4. Next create a _.env_ file in the root of your project folder.
5. Create an _Azure AI Search Service_ in your Azure resources [AI Search](https://learn.microsoft.com/en-us/azure/search/search-create-service-portal). Copy the Search Service name, the Search Service Key, and the search index name. Set these to the **SEARCH_SERVICE**, **AZURE_SEARCH_KEY** and **INDEX_NAME** properties respectively in the _.env_ file.
6. Create a HuggingFace Hub token by following the steps listed at [HuggingFaceHub](https://huggingface.co/docs/api-inference/en/quicktour) and set it to the **HUGGINGFACE_TOKEN** env variable.
7. Create an _OpenAI_ account. Due to the use of GPT-4 models, a free-tier account won't be sufficient for this project. Set up your OpenAI API key [OpenAI](https://platform.openai.com/docs/quickstart) and set it to the **OPENAI_API_KEY** env variable.

## Set-Up Next.Js

1. Ensure that your system has Python version 3.11 installed. To install, visit the official Python website at [Python 3.11](https://www.python.org/downloads/).
2. Install NPM (node package manager) version 9.6.7 or higher and Node version 18.17.0 or higher. Installation steps can be found at [NodeJs](https://nodejs.org/en/download).
3. Setup the Next.js frontend by:

```console
cd Client
npm install
```

This sets up the Next.js frontend and installs all the dependencies.

4. The Next.js App can be started by using the following commands in the terminal:

```console
npm run dev
```

Now open up localhost:3000 in your browser to view the Next.js app. Since the backend isn't up and running yet, some features of the app won't run. We want to set it up next.

## Setting Up the Flask Backend

1. Navigate back to the EvaluateWise root folder using:

```console
cd ..
```

2. Create a _local Python 3.11 environment_ **(highly recommended)**. You can ignore this step and install without setting up the environment, but that would lead to issues if changes are made in the future. For steps to set up a local environment and activate it, we prefer the venv package. The steps for using it are:

```console
pip install venv
py -m venv .venv
.venv\Scripts\activate
```

This should activate the virtual environment, indicated by a (venv) prefix in your terminal.

3. Next, install all the dependencies for the Flask App and run the Flask App by running the following commands:

```console
pip install -r requirements.txt
cd backend
python3 app.py
```

This should start the backend server on localhost:5000. The API can be tested for responses using any API Testing Framework like Postman, PlayWright, etc.

4. Now you can test the app by checking its various features. An explanation of how to navigate the web app is given in the discussion of the Web App below

## Running Interactive Notebooks

To run the interactive notebooks present in the Notebooks section, the following steps should be followed:

1. Install Jupyter Notebooks by following the steps listed in [Jupyter Install](https://jupyter.org/install).
2. By using the interactive Jupyter Notebook editor, run any of the notebooks present in the folder. Dependencies of these notebooks are present in _requirements.txt_ and can be installed by using the following command:

```console
pip install -r requirements.txt
```

3. Alternatively, all the notebooks can be run without installing Jupyter by using an online IPython environment like _Google Colab_.

# How does the App work

A schematic explanation of how the web app portal is used by both teachers and students is shown.

The teacher logs in to the portal, selects the subjects, and then uploads the question details like the title, marks of the question, and the type of question. The answer to that question is generated using the RAG model and stored in the MongoDB database along with the question details.

The teacher can also upload subject-related documents in the form of PDF files to act as context for the RAG model.

The answers are compared when the teacher moves to the Add Answers Tab. There they can upload an image of the student answer and compare it with the model answer, generating grades based on it.

![flow-diagram](/Images/flow.PNG)
