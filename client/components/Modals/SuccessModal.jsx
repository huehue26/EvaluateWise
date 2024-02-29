// SuccessModal.js
import React from 'react'
import { FaCheck } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className='z-50 h-screen w-screen fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center overflow-y-hidden'>
      <div className='h-40 w-64 p-6 bg-white flex flex-col items-center justify-center rounded-lg'>
        <button
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-800'
          onClick={onClose}
        >
          <ImCross size={16} />
        </button>
        <div className='text-green-500'>
          <FaCheck size={40} />
        </div>
        <p className='text-green-500 font-semibold mt-2 mb-4'>{message}</p>
        <button
          className='py-2 rounded px-4 bg-blue-600 text-white'
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default SuccessModal
