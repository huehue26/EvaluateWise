import clientPromise from '../../mongodb-config'
import axios from 'axios'

export default async function AddQuestion(req, res) {
  if (req.method === 'POST') {
    const client = await clientPromise
    const db = client.db('question')
    const subject = String(req.body.subject)
    const title = String(req.body.title)
    const type = String(req.body.type)
    try {
      const collection = db.collection(subject)

      const response = await axios.post(
        `${process.env.API_URI}/api/v1/ask_question`,
        {
          question: title,
          subject: subject,
          type: type,
        }
      )

      const question = {
        title: req.body.title,
        max_marks: req.body.max_marks,
        type: req.body.type,
        answer: response.data.answer,
      }
      await collection.insertOne(question)
      res.json('Success')
    } catch (e) {
      console.log(e)
      res.json(e.message)
    }
  } else {
    res.json({ message: 'This request is not allowed', user: false })
  }
}
