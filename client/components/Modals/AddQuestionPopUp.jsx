import axios from "axios";
import React, { useState } from "react";
import { ImCross } from "react-icons/im";
import { useTranslation } from "react-i18next";

export default function AddQuestionPopUp({ setopenAddQuestion, subject, setreload, reload }) {
  const [quesTitle, setquesTitle] = useState("");
  const [quesType, setquesType] = useState("short");
  const [quesMaxMarks, setquesMaxMarks] = useState("0");
  const { t } = useTranslation();

  const addQuestionHandler = async () => {
    const response = await axios.post("/api/add-question", {
      subject: subject,
      title: quesTitle,
      max_marks: quesMaxMarks,
      type: quesType,
    });
    console.log(response.data);
    setopenAddQuestion(false);
    setreload(!reload)
  };

  return (
    <div className="z-50 h-screen w-screen fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center overflow-y-hidden">
      <div className="h-5/6 w-1/2 p-6 bg-gray-100 flex items-center justify-center rounded-lg">
        <div className="h-full container max-w-screen-lg mx-auto">
          <div>
            <h2 className="font-semibold text-xl flex justify-between items-center text-gray-800 mb-5">
              <div>{t("Add New Question")}</div>
              <div>
                <button
                  className="hover:text-slate-500"
                  onClick={() => setopenAddQuestion(false)}
                >
                  <ImCross />
                </button>
              </div>
            </h2>
            <div className="h-112 overflow-y-scroll bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-gray-600">
                  <p className="font-medium text-lg">{t("Question Details")}</p>
                  <p>{t("Please fill out all the fields")}.</p>
                </div>
              </div>
              <div>
                <div className="lg:col-span-2 mt-6">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5">
                      <label htmlFor="type">{t("Question Type")}</label>
                      <select
                        name="type"
                        id="type"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        onChange={(e) => setquesType(e.target.value)}
                      >
                        <option value="short">Short Answer</option>
                        <option value="long">Long Answer</option>
                        <option value="coding">Coding</option>
                      </select>
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="marks">
                        {t("Question Maximum Score")}
                        <span className="text-red-500 pl-1">*</span>
                      </label>
                      <input
                        type="number"
                        name="marks"
                        id="marks"
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={quesMaxMarks}
                        onChange={(e) => setquesMaxMarks(e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label htmlFor="title">
                        {t("Question Title")}
                        <span className="text-red-500 pl-1">*</span>
                      </label>
                      <textarea
                        rows="5"
                        className="pt-2 border mt-1 rounded px-4 w-full bg-gray-50"
                        value={quesTitle}
                        onChange={(e) => setquesTitle(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <button
                  className="bg-blue-500 hover:bg-blue-700 w-full text-white font-bold py-2 px-4 rounded"
                  onClick={() => addQuestionHandler()}
                >
                  Add Question
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
