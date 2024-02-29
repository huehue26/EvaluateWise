import React from 'react'
import { ImCross } from 'react-icons/im'

const AnswerModal = ({ question, onClose }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div
        className='bg-white p-6 rounded shadow-md max-w-3xl max-h-3/4 overflow-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <button className='hover:text-slate-500' onClick={() => onClose()}>
          <ImCross />
        </button>
        <p className='font-semibold mb-4'>{question.title}</p>
        <p className='text-gray-700'>{question.answer}</p>
      </div>
    </div>
  )
}

export default AnswerModal
