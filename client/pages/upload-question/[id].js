import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Header } from "../../components";
import { useRouter } from "next/router";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";

export default function UploadQuestion() {
  const router = useRouter();
  const [questionList, setquestionList] = useState();
  const [questionTitle, setquestionTitle] = useState("");
  const [reload, setreload] = useState(true)

  const addQuestionHandler = async () => {
    await axios.post("/api/add-question", {
      subject: router.query.id,
      title: questionTitle,
    });
    setreload(!reload)
  };

  const deleteVideoLinkHandler = async (question) => {
    await axios.post("/api/delete-question", {
      subject: router.query.id,
      title: question,
    });
    setreload(!reload)
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
        <Header category="Pages" title="Upload Question" />
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
        <div>
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
        </div>
      </div>
    </Layout>
  );
}
