import clientPromise from '../../mongodb-config'

export default async function DeleteQuestion(req, res) {
  if (req.method === 'POST') {
    const client = await clientPromise
    const db = client.db('question')
    const subject = String(req.body.subject)

    try {
      const collection = db.collection(subject)
      const questionTitle = req.body.title

      const result = await collection.deleteOne({ title: questionTitle })

      if (result.deletedCount === 1) {
        res.json('Success')
      } else {
        res.json('Question not found')
      }
    } catch (e) {
      console.log(e)
      res.json('Failure')
    }
  } else {
    res.json({ message: 'This request is not allowed', user: false })
  }
}
