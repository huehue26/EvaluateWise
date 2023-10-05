import clientPromise from "../../mongodb-config";

export default async function GetQuestion(req, res) {
  if (req.method === "POST") {
    const client = await clientPromise;
    const db = client.db("question");
    console.log(req.body);
    const subject = String(req.body.subject)
    console.log(subject)
    const questionList = await db
      .collection(subject)
      .find({})
      .toArray();
    console.log(questionList);
    res.json(questionList);
  } else {
    res.json({ message: "This request is not allowed", user: false });
  }
}
