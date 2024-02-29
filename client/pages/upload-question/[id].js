import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'

import { useRouter } from 'next/router'
import axios from 'axios'
import { AiFillDelete } from 'react-icons/ai'
import AddQuestionPopUp from '../../components/Modals/AddQuestionPopUp'
import UploadDocumentPopUp from '../../components/Modals/UploadDocumentsPopUp'
import AnswerModal from '../../components/Modals/AnswerModal'
import { useTranslation } from 'react-i18next'

export default function UploadQuestion() {
  const router = useRouter()
  const [questionList, setquestionList] = useState()

  const [openAddQuestion, setopenAddQuestion] = useState(false)
  const [openUploadDocument, setopenUploadDocument] = useState(false)
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [reload, setreload] = useState(true)

  const { t } = useTranslation()

  const deleteVideoLinkHandler = async (question) => {
    await axios.post('/api/delete-question', {
      subject: router.query.id,
      title: question,
    })
    setreload(!reload)
  }
  const openAnswerModal = (question) => {
    setSelectedQuestion(question)
    setIsAnswerModalOpen(true)
  }
  const closeAnswerModal = () => {
    setIsAnswerModalOpen(false)
    setSelectedQuestion(null)
  }

  useEffect(() => {
    const getQuestionList = async () => {
      const response = await axios.post('/api/get-question', {
        subject: router.query.id,
      })
      setquestionList(response.data)
    }
    getQuestionList()
  }, [router.query.id, reload])

  return (
    <Layout>
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl '>
        <div className='mb-10'>
          <p className='text-gray-400'>Pages</p>
          <p className='flex'>
            <p className='text-3xl font-extrabold tracking-tight text-slate-900'>
              Upload Question
            </p>
            <p
              className='rounded-full font-bold text-2xl ml-5 cursor-pointer px-2 hover:bg-slate-200'
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
          ''
        )}
        <div>
          {questionList &&
            questionList.map((question, index) => {
              return (
                <div className='flex py-2 w-full' key={index}>
                  <div className='flex justify-between items-center hover:bg-slate-100 rounded p-1 w-full mr-10'>
                    <div className='flex'>
                      <div className='mr-2 pl-2'>{index + 1}.</div>
                      <div>{question.title}</div>
                    </div>
                    <div className='flex space-x-2'>
                      {/* Show Answer button */}
                      <button
                        className='py-1 px-3 bg-blue-500 text-white rounded'
                        onClick={() => openAnswerModal(question)}
                      >
                        Show Answer
                      </button>
                      <span
                        className='text-red-500 hover:text-red-700 cursor-pointer p-1'
                        onClick={() => {
                          deleteVideoLinkHandler(question.title)
                        }}
                      >
                        <AiFillDelete size={20} />
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          {isAnswerModalOpen && (
            <AnswerModal
              question={selectedQuestion}
              onClose={closeAnswerModal}
            />
          )}
        </div>

        {openUploadDocument ? (
          <UploadDocumentPopUp
            setopenUploadDocuments={setopenUploadDocument}
            subject={router.query.id}
            setreload={setreload}
            reload={reload}
          />
        ) : (
          ''
        )}

        <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl '>
          <div className='mb-10'>
            <p className='flex'>
              <p className='text-3xl text-start font-extrabold tracking-tight text-slate-900'>
                Upload Documents
              </p>
              <p
                className='rounded-full font-bold text-2xl ml-5 cursor-pointer px-2 hover:bg-slate-200'
                onClick={() => setopenUploadDocument(true)}
              >
                +
              </p>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
