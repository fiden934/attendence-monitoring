
import { GoogleGenAI } from "@google/genai";
import { Student } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a placeholder check. The environment variable is expected to be set.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateAttendanceReport = async (presentStudents: Student[], absentStudents: Student[]): Promise<string> => {
  const presentNames = presentStudents.map(s => s.name).join(', ') || 'None';
  const absentNames = absentStudents.map(s => s.name).join(', ') || 'None';

  const prompt = `
    Generate a concise and professional attendance report for a college class session.
    Format the output as clean Markdown.

    **Date:** ${new Date().toLocaleDateString()}
    
    **Attendance Summary:**
    - Total Students: ${presentStudents.length + absentStudents.length}
    - Present: ${presentStudents.length}
    - Absent: ${absentStudents.length}

    **Detailed Roster:**

    **Present Students:**
    ${presentStudents.length > 0 ? presentStudents.map(s => `- ${s.name} (ID: ${s.id})`).join('\n') : '- None'}

    **Absent Students:**
    ${absentStudents.length > 0 ? absentStudents.map(s => `- ${s.name} (ID: ${s.id})`).join('\n') : '- None'}

    **Concluding Remarks:**
    Provide a brief, positive concluding remark about the session's attendance. If there are many absentees, suggest a follow-up.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};
