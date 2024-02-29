import clientPromise from '../../mongodb-config'

export default async function GetQuestion(req, res) {
  if (req.method === 'POST') {
    const client = await clientPromise
    const db = client.db('question')
    const subject = String(req.body.subject)
    const questionList = await db.collection(subject).find({}).toArray()
    res.json(questionList)
  } else {
    res.json({ message: 'This request is not allowed', user: false })
  }
}
