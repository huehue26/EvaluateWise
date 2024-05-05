import axios from 'axios'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImCross } from 'react-icons/im'
import SuccessModal from './SuccessModal'
import Loader from './Loader'

export default function UploadQuestionPopup({
  setopenUploadDocuments,
  subject,
  setreload,
  reload,
}) {
  const [questionContext, setquestionContext] = useState()
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const { t } = useTranslation()

  const uploadQuestionContextHandler = async () => {
    try {
      const formData = new FormData()
      formData.append('subject', subject)
      formData.append('pdf_file', questionContext)
      setLoading(true)
      const response = await axios.post(
        `http://127.0.0.1:5000/api/v1/upload_file`,
        formData
      )

      setopenUploadDocuments(false)
      setreload(!reload)
      setSuccessMessage('Upload successful!')
    } catch (error) {
      setopenUploadDocuments(false)
      setreload(!reload)
      setLoading(false)
      setSuccessMessage('Operation failed!')
    }
  }
  const closeSuccessModal = () => {
    setSuccessMessage('')
  }

  return (
    <div className='z-50 h-screen w-screen fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center overflow-y-hidden'>
      <div className=' w-1/2 p-6 bg-gray-100 flex items-center justify-center rounded-lg'>
        <div className='h-full container max-w-screen-lg mx-auto'>
          <div>
            <h2 className='font-semibold text-xl flex justify-between items-center text-gray-800 mb-5'>
              <div>{t('Add Subject Documentation')}</div>
              <div>
                <button
                  className='hover:text-slate-500'
                  onClick={() => setopenUploadDocuments(false)}
                >
                  <ImCross />
                </button>
              </div>
            </h2>
            <div className='mt-10'>
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
                      <span className='font-semibold'>Click to upload</span> or
                      drag and drop
                    </p>
                    {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p> */}
                  </div>
                  <input
                    id='dropzone-file'
                    type='file'
                    className='hidden'
                    onChange={(e) => setquestionContext(e.target.files[0])}
                  />
                </label>
              </div>
              <div>
                {loading ? (
                  <Loader
                    type='Puff'
                    color='#00BFFF'
                    height={100}
                    width={100}
                    timeout={3000}
                  />
                ) : (
                  <button
                    className='py-2 mt-6 ml-2 rounded px-12 bg-blue-600 text-slate-50'
                    onClick={() => uploadQuestionContextHandler()}
                    disabled={loading}
                  >
                    Upload
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {successMessage && (
        <SuccessModal message={successMessage} onClose={closeSuccessModal} />
      )}
    </div>
  )
}
