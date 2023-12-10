import React from 'react'
import Layout from '../../components/Layout'
import { Header } from '../../components'
import Link from 'next/link'

export default function UploadQuestion() {
  return (
    <Layout>
      <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl '>
        <Header category='Pages' title='Upload Question' />
        <div>
          <div className='flex flex-row justify-center items-center'>
            <div className='h-30 hover:bg-rose-50 transition duration-500 hover:scale-105 hover:shadow-2xl w-72 m-10 p-10 rounded-xl shadow-xl shadow-gray-400 border-4 border-white border-t-rose-500 cursor-pointer'>
              <Link href='/upload-question/web-dev'>
                <div>
                  <h2 className='font-extrabold text-2xl text-gray-600 pb-2'>
                    Web Dev
                  </h2>
                  <p className='text-zinc-500 font-semibold'>
                    EWeb development is the process of creating and maintaining
                    websites or web applications. It involves designing the user
                    interface (web design), building the visual elements and
                    interactivity (front-end development), implementing
                    server-side logic and databases (back-end development), and
                    configuring web servers. Full-stack developers are
                    proficient in both front-end and back-end development.
                  </p>
                </div>
              </Link>
            </div>
            <div className='flex flex-col'>
              <div className='h-30 hover:shadow-2xl w-72 m-10 p-10 rounded-xl shadow-xl shadow-gray-400 border-4  border-t-lime-500 cursor-pointer hover:bg-lime-50 transition duration-500 hover:scale-105'>
                <Link href='/upload-question/big-data-analytics'>
                  <div>
                    <h2 className='font-extrabold text-2xl text-gray-600 pb-2'>
                      Big Data Analytics
                    </h2>
                    <p className='text-zinc-500 font-semibold'>
                      Big data primarily refers to data sets that are too large
                      or complex to be dealt with by traditional data-processing
                      application software.
                    </p>
                  </div>
                </Link>
              </div>
              <div className='h-30 hover:bg-teal-50 transition duration-500 hover:scale-105 hover:shadow-2xl w-72 m-10 p-10 rounded-xl shadow-xl shadow-gray-400 border-4  border-t-teal-600   cursor-pointer'>
                <Link href='/upload-question/maths'>
                  <div>
                    <h2 className='font-extrabold text-2xl text-gray-600 pb-2'>
                      Maths
                    </h2>
                    <p className='text-zinc-500 font-semibold'>
                      Mathematics is an area of knowledge, which includes the
                      study of such topics arithmetic and number theory,
                      algebra, geometry
                    </p>
                  </div>
                </Link>
              </div>
              <div className='h-30 hover:bg-blue-50 transition duration-500 hover:scale-105 hover:shadow-2xl w-72 m-10 p-10 rounded-xl shadow-xl shadow-gray-400 border-4 border-t-blue-600   cursor-pointer'>
                <Link href='/upload-question/compiler'>
                  <div>
                    <h2 className='font-extrabold text-2xl text-gray-600 pb-2'>
                      Compiler
                    </h2>
                    <p className='text-zinc-500 font-semibold'>
                      Compiler design is creating a program that translates
                      human-written code into a form computers can understand
                      and execute.
                    </p>
                  </div>
                </Link>
              </div>
            </div>
            <div className='h-30 hover:bg-orange-50 transition duration-500 hover:scale-105 hover:shadow-2xl w-72 m-10 p-10 rounded-xl shadow-xl shadow-gray-400 border-4 border-white border-t-orange-600   cursor-pointer'>
              <Link href='/upload-question/science'>
                <div>
                  <h2 className='font-extrabold text-2xl text-gray-600 pb-2'>
                    Science
                  </h2>
                  <p className='text-zinc-500 font-semibold'>
                    The intellectual and practical activity encompassing the
                    systematic study of the structure and behaviour of the
                    physical and natural world through observation and
                    experiment.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
