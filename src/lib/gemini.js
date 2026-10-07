import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️ Cảnh báo: Biến môi trường GEMINI_API_KEY chưa được thiết lập trong .env!');
}

export const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Vui lòng định nghĩa biến GEMINI_API_KEY trong file .env hoặc trên Vercel/Render.');
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

export default getGeminiClient;
