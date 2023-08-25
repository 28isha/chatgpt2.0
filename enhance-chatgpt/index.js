const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const cors = require('cors');

const configuration = new Configuration({
  apiKey: "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", 
});

const openai = new OpenAIApi(configuration);

const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Define a route handler for generating text
app.post('/', async (req, res) => {
  try {
    const { message,currentModel } = req.body;
    console.log(message, "message");
    console.log(currentModel, "currentModel");
    const response = await openai.createCompletion({
      model: `${currentModel}`,
      prompt: `${message}`,
      max_tokens: 100,
      temperature: 0.5,
    });

    const generatedText = response.data.choices[0].text;

    res.json({
      message: generatedText,
    });
  } catch (error) {
    console.error("Error processing request:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define a route handler for listing models
app.get('/models', async (req, res) => {
  try {
    const response = await openai.listEngines();
    console.log(response.data.data)
    res.json({
      models: response.data.data,
    });
  } catch (error) {
    console.error("Error listing models:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
