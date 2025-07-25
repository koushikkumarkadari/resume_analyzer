const PDFParser = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const analyzeResume = async (fileBuffer) => {
  try {
    // Step 1: Extract text from the PDF
    const pdfData = await PDFParser(fileBuffer);
    const resumeText = pdfData.text.trim();

    // Step 2: Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Step 3: Define the prompt for the Gemini API
    const prompt = `
      You are an expert technical recruiter and career coach. Analyze the following resume text and extract the information into a valid JSON object. The JSON object must conform to the following structure, and all fields must be populated. If a field cannot be confidently extracted, use null or an empty array ([]) as appropriate. Do not include any text or markdown formatting before or after the JSON object.

      Resume Text:
      """
      ${resumeText}
      """

      JSON Structure:
      {
        "name": "string | null",
        "email": "string | null",
        "phone": "string | null",
        "linkedin_url": "string | null",
        "portfolio_url": "string | null",
        "summary": "string | null",
        "work_experience": [{ "role": "string", "company": "string", "duration": "string", "description": ["string"] }],
        "education": [{ "degree": "string", "institution": "string", "graduation_year": "string" }],
        "technical_skills": ["string"],
        "soft_skills": ["string"],
        "projects": [{ "name": "string", "description": "string" }],
        "certifications": ["string"],
        "resume_rating": "number (1-10)",
        "improvement_areas": "string",
        "upskill_suggestions": ["string"]
      }
    `;
    console.log('Prompt sent to Gemini API:');
    // Step 4: Generate content using Gemini API
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    // Remove Markdown code block if present
    const cleanedText = responseText.replace(/```json|```/g, '').trim();
    try {
      return JSON.parse(cleanedText);
    } catch (err) {
      console.error('Gemini response not valid JSON:', cleanedText);
      throw new Error('Gemini API did not return valid JSON');
    }
  } catch (error) {
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
};

module.exports = { analyzeResume };