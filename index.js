import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import env from "dotenv";
import { Configuration, OpenAIApi } from "openai";

const app = express();

env.config();

app.use(
  cors({
    origin: ["http://127.0.0.1:5173", "https://gms-chatbot.vercel.app/"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// Configure open api
const configuration = new Configuration({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.API_KEY,
});
const openAI = new OpenAIApi(configuration);

// Listening
app.listen("3080", () => console.log("listening on port 3080"));

// Dummy route to test
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// post route for making requests
app.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openAI.createCompletion({
      model: "text-davinci-003",
      prompt: `${message}`,
      max_tokens: 2048,
      temperature: 0,
      top_p: 1,
    });
    res.json({ message: response.data.choices[0].text });
  } catch (e) {
    console.log(e);
    res.send(e).status(400);
  }
});
