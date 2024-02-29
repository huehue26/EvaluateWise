import clientPromise from '../../mongodb-config'

export default async function Login(req, res) {
  if (req.method === 'POST') {
    const client = await clientPromise
    const db = client.db('main')
    const userDetails = await db
      .collection('user')
      .find({ user_id: req.body.user_id })
      .toArray()
    if (userDetails.length) {
      if (userDetails[0].password === req.body.password)
        res.json({ message: 'Succesful', user: true })
      else
        res.json({ message: "User id and password doesn't match", user: false })
    } else res.json({ message: 'No user found', user: false })
  } else {
    res.json({ message: 'This request is not allowed', user: false })
  }
}
