import React from 'react'
import { ImCross } from 'react-icons/im'

export default function EvaluationPopUp({
  question,
  correctAnswer,
  score,
  maxMarks,
  userAnswer,
  sources,
  setopenPopUp,
}) {
  return (
    <div className='z-50 h-screen w-screen fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center overflow-hidden'>
      <div className='h-5/6 w-1/2 p-6 bg-gray-50 flex items-center justify-center rounded-lg'>
        <div className='h-full container max-w-screen-lg'>
          <div>
            <h2 className='font-semibold text-xl flex justify-between items-center text-gray-600 mb-5'>
              <div></div>
              <div>
                <button
                  className='hover:text-slate-500'
                  onClick={() => setopenPopUp(false)}
                >
                  <ImCross />
                </button>
              </div>
            </h2>
            <div>
              <span className='font-bold pr-2'>Question :</span>
              {question}
            </div>
            <div className='pt-3 h-52 overflow-y-scroll w-full'>
              <div className='font-bold'>Expected Answer : </div>
              <div>{correctAnswer}</div>
            </div>
            <div className='pt-3 overflow-y-scroll h-52 w-full'>
              <div className='font-bold'>Your Answer : </div>
              <div>{userAnswer}</div>
            </div>
            <div className='pt-3 h-52 w-full'>
              <div className='font-bold'>Your marks : </div>
              <div>
                {score} / {maxMarks}
              </div>
            </div>
            <div className='pt-3 overflow-y-scroll h-52 w-full'>
              <div className='font-bold'>Sources used: </div>
              <div>{sources}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
