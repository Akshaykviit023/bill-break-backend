import { request, response } from "express";
import { createWorker } from "tesseract.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Create the __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getImageData = async (request, response, next) => {
    try {
        const imagePath = path.join(__dirname, "..", "uploads", request.file.filename);
        console.log("impath")
        // Initialize Tesseract worker
        const worker = await createWorker('eng');
        const ret = await worker.recognize(imagePath);
        console.log(ret.data.text);
        const data = ret.data.text;
    
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: { responseMimeType: "application/json" },
        });
    
        const prompt = `Extract and format the following document's body into a key-value pair structure, excluding the header and footer.\n${data}\nEnsure that the keys inside the Items array are strictly named as 'item'  and 'amount'. And finally 'Total' must be there, if not available then it should be calculated.`;
    
        const result = await model.generateContent(prompt);
        const resp = await result.response;
        const parsedText = JSON.parse(await resp.text());
    
        await worker.terminate();
    
        // Delete the uploaded image after processing
        fs.unlinkSync(imagePath);

        console.log(parsedText)
    
        return response.status(200).json({ message: "OK", text: parsedText });
      } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "ERROR", cause: error.message });
      }
}
