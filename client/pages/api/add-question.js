import clientPromise from "../../mongodb-config";
import axios from "axios";

export default async function AddQuestion(req, res) {
  if (req.method === "POST") {
    const client = await clientPromise;
    const db = client.db("question");
    const subject = String(req.body.subject);
    
    try {
      const collection = db.collection(subject);
      
      // const response = await axios.post("/ask_question", {
      //   question : title,
      //   subject: subject
      // })

      // console.log(response)

      const question = {
        title: req.body.title,
        max_marks: req.body.max_marks,
        type: req.body.type,
        answer: "to be evaluated from api"
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
