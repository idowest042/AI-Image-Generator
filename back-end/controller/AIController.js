// controller/AIController.js
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

export const generateImage = async (req, res) => {
  try {
    console.log("🔹 Starting image generation...");

    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const url =
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

    const headers = {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "image/png", // ✅ Important: tell Hugging Face we want an image
    };

    console.log("🧠 Sending request to:", url);

    const response = await axios.post(
      url,
      { inputs: prompt },
      { headers, responseType: "arraybuffer" } // binary response
    );

    // Optional: save image to disk
    fs.writeFileSync("generated-image.png", response.data);
    console.log("✅ Image saved as generated-image.png");

    // ✅ Send the image back to Postman
    res.set("Content-Type", "image/png");
    res.send(response.data);
  } catch (error) {
    console.log("❌ ERROR OCCURRED");

    if (error.response) {
      console.log("Status:", error.response.status);
      const rawData = error.response.data.toString();
      console.log("Raw Response Text:", rawData.slice(0, 500));
      return res.status(error.response.status).json({ error: rawData });
    } else {
      console.log("Message:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
};
