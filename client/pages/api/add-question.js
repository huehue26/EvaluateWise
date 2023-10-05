import clientPromise from "../../mongodb-config";

export default async function AddQuestion(req, res) {
  if (req.method === "POST") {
    const client = await clientPromise;
    const db = client.db("question");
    const subject = String(req.body.subject);
    
    try {
      const collection = db.collection(subject);
      const question = {
        title: req.body.title,
      };
      await collection.insertOne(question);
      res.json("Success");
    } catch (e) {
      console.log(e);
      res.json("Failure");
    }
  } else {
    res.json({ message: "This request is not allowed", user: false });
  }
}
