import React from "react";
import { ImCross } from "react-icons/im";

export default function EvaluationPopUp({
  question,
  correctAnswer,
  score,
  setopenPopUp,
}) {
  return (
    <div className="z-50 h-screen w-screen fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center overflow-y-hidden">
      <div className="h-5/6 w-1/2 p-6 bg-gray-50 flex items-center justify-center rounded-lg">
        <div className="h-full container max-w-screen-lg mx-auto">
          <div>
            <h2 className="font-semibold text-xl flex justify-between items-center text-gray-600 mb-5">
              <div></div>
              <div>
                <button
                  className="hover:text-slate-500"
                  onClick={() => setopenPopUp(false)}
                >
                  <ImCross />
                </button>
              </div>
            </h2>
            <div>
              <span className="font-bold pr-2">Question :</span>
              {question}
            </div>
            <div className="pt-3">
              <div className="font-bold">Expected Answer : </div>
              <div>{correctAnswer}s</div>
            </div>
            <div className="mt-6">
              <div className="mt-2 bg-gray-600 rounded-full">
                <div
                  className="mt-2 bg-blue-500 text-center rounded-full"
                  style={{ width: `${score}%` }}
                >
                  <div className="text-white text-sm inline-block bg-blue-500 px-2 rounded-full">
                    {score}% correct answer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
