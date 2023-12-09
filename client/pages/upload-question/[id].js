import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Header } from "../../components";
import { useRouter } from "next/router";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import AddQuestionPopUp from "../../components/Modals/AddQuestionPopUp";
import { useTranslation } from "react-i18next";

export default function UploadQuestion() {
  const router = useRouter();
  const [questionList, setquestionList] = useState();
  const [questionContext, setquestionContext] = useState();
  const [openAddQuestion, setopenAddQuestion] = useState(false);
  const [reload, setreload] = useState(true);

  const { t } = useTranslation();

  const deleteVideoLinkHandler = async (question) => {
    await axios.post("/api/delete-question", {
      subject: router.query.id,
      title: question,
    });
    setreload(!reload);
  };

  const uploadQuestionContextHandler = async () => {
    const formData = new FormData();
    formData.append("subject", router.query.id);
    formData.append("pdf_file", questionContext);
    const response = await axios.post(
      "http://127.0.0.1:5000/upload_file",
      formData
    );
    console.log(response);
  };

  useEffect(() => {
    const getQuestionList = async () => {
      const response = await axios.post("/api/get-question", {
        subject: router.query.id,
      });
      setquestionList(response.data);
    };
    getQuestionList();
  }, [router.query.id, reload]);

  return (
    <Layout>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl ">
        <div className="mb-10">
          <p className="text-gray-400">Pages</p>
          <p className="flex">
            <p className="text-3xl font-extrabold tracking-tight text-slate-900">
              Upload Question
            </p>
            <p
              className="rounded-full font-bold text-2xl ml-5 cursor-pointer px-2 hover:bg-slate-200"
              onClick={() => setopenAddQuestion(true)}
            >
              +
            </p>
          </p>
        </div>
        {openAddQuestion ? (
          <AddQuestionPopUp
            setopenAddQuestion={setopenAddQuestion}
            subject={router.query.id}
            setreload={setreload}
            reload={reload}
          />
        ) : (
          ""
        )}
        <div>
          {questionList &&
            questionList.map((question, index) => {
              console.log(question);
              return (
                <div className="flex py-2 w-full" key={index}>
                  <div className="flex justify-between items-center hover:bg-slate-100 rounded p-1 w-full mr-10">
                    <div className="flex">
                      <div className="mr-2 pl-2">{index + 1}.</div>
                      <div>{question.title}</div>
                    </div>
                    <span
                      className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                      onClick={() => {
                        deleteVideoLinkHandler(question.title);
                      }}
                    >
                      <AiFillDelete size={20} />
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* <div>
          <div>
            <div className="grid grid-cols-4 mt-4">
              <div className="col-span-3">
                <input
                  type="text"
                  id="small-input"
                  class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 py-2"
                  onChange={(e) => setquestionTitle(e.target.value)}
                />
              </div>
              <div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 ml-7 w-56 text-white font-bold py-2 px-4 rounded"
                  onClick={() => addQuestionHandler()}
                >
                  Add Question
                </button>
              </div>
            </div>
          </div>
        </div> */}

        <div className="mt-10">
          <Header title="Add Subject Context" />
          <div className="flex items-center justify-center w-full mt-7">
            <label
              for="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p> */}
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={(e) => setquestionContext(e.target.files[0])}
              />
            </label>
          </div>
          <div>
            <button
              className="py-2 mt-6 ml-2 rounded px-12 bg-blue-600 text-slate-50"
              onClick={() => uploadQuestionContextHandler()}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
