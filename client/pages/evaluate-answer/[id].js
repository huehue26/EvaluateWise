import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { Header } from '../../components'
import { useRouter } from 'next/router'
import axios from 'axios'
import EvaluationPopUp from '../../components/Modals/EvaluationPopUp'
import Loader from '../../components/Modals/Loader'

export default function EvaluateAnswer() {
  const router = useRouter()
  const [questionDetails, setquestionDetails] = useState()
  const [questionList, setquestionList] = useState('')
  const [reload, setreload] = useState(true)
  const [answerSheetFile, setanswerSheetFile] = useState()
  const [openEvaluationPopUp, setopenEvaluationPopUp] = useState(false)
  const [modelAnswer, setModelAnswer] = useState('')
  const [userAnswer, setUserAnswer] = useState('')
  const [userScore, setUserScore] = useState(0)
  const [openLoader, setopenLoader] = useState(false)

  const evaluateAnswerHandler = async () => {
    await setopenLoader(true)
    const formData = new FormData()
    formData.append('image', answerSheetFile)
    formData.append('title', questionDetails.title)
    formData.append('marks', questionDetails.max_marks)
    formData.append('answer', questionDetails.answer)
    formData.append('type', questionDetails.type)
    const response = await axios.post(
      `${process.env.API_URI}/api/v1/translate_image`,
      formData
    )
    setModelAnswer(response['data']['answer'])
    setUserScore(response['data']['score'])
    setUserAnswer(response['data']['userAnswer'])
    await setopenLoader(false)
    setopenEvaluationPopUp(true)
  }

  useEffect(() => {
    const getQuestionList = async () => {
      const response = await axios.post('/api/get-question', {
        subject: router.query.id,
      })
      setquestionList(response.data)
    }
    getQuestionList()
  }, [router.query.id, openEvaluationPopUp])

  return (
    <Layout>
      {openEvaluationPopUp ? (
        <EvaluationPopUp
          question={questionDetails.title}
          correctAnswer={modelAnswer}
          score={userScore}
          maxMarks={questionDetails.max_marks}
          userAnswer={userAnswer}
          sources={questionDetails.sources}
          setopenPopUp={setopenEvaluationPopUp}
        />
      ) : (
        ''
      )}
      {openLoader ? <Loader /> : ''}
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl '>
        <Header category='Pages' title='Evaluate Answer' />
        <div className='py-5 text-md font-bold'>
          Select the question to evaluate
        </div>
        <ul class='w-full'>
          {questionList &&
            questionList.map((question, index) => {
              return (
                <li class='w-full' key={index}>
                  <div class='flex items-center pl-3'>
                    <input
                      id={question.title}
                      type='radio'
                      value={question.title}
                      name='list-radio'
                      className='h-4 w-4'
                      onClick={() => {
                        setquestionDetails(question)
                      }}
                    />
                    <label
                      for={question.title}
                      className='w-full py-3 ml-2 hover:cursor-pointer'
                    >
                      {question.title}
                    </label>
                  </div>
                </li>
              )
            })}
        </ul>

        <div className='flex items-center justify-center w-full mt-7'>
          <label
            for='dropzone-file'
            className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
          >
            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
              <svg
                className='w-8 h-8 mb-4 text-gray-500 dark:text-gray-400'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 16'
              >
                <path
                  stroke='currentColor'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                />
              </svg>
              <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                <span className='font-semibold'>Click to upload</span> or drag
                and drop
              </p>
              {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p> */}
            </div>
            <input
              id='dropzone-file'
              type='file'
              className='hidden'
              onChange={(e) => setanswerSheetFile(e.target.files[0])}
            />
          </label>
        </div>
        <div>
          <button
            className='py-2 mt-6 ml-2 rounded px-12 bg-blue-600 text-slate-50'
            onClick={() => evaluateAnswerHandler()}
          >
            Evaluate
          </button>
        </div>
      </div>
    </Layout>
  )
}
