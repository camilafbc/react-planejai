import type { VercelRequest, VercelResponse } from '@vercel/node'
import process from 'process'

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
    }
  }[]
}

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: {
    content: string
  }
  suggestions: {
    items: string[]
  }
  extraIncome: {
    items: string[]
  }
  investment: {
    items: string[]
  }
  motivation: {
    content: string
  }
}

const API_KEY = process.env.GEMINI_API_KEY
const MODEL_NAME = process.env.MODEL_NAME
const GEMINI_APIURL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

const callGeminiAPI = async (prompt: string): Promise<GeminiResponse> => {
  if (!API_KEY) {
    throw new Error('A variável GEMINI_API_KEY não foi configurada na Vercel.')
  }

  const response = await fetch(GEMINI_APIURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Erro na API do Gemini: ${response.status}`)
  }

  return (await response.json()) as GeminiResponse
}

// Handler padrao das Serverless Functions da Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'O prompt é obrigatório' })
    }

    const response = await callGeminiAPI(prompt)
    const rawText = response.candidates[0].content.parts[0].text

    const insightData: InsightData = JSON.parse(rawText)

    // Retorna o objeto ja parsed e estruturado pro front-end
    return res.status(200).json(insightData)
  } catch (error: any) {
    console.error('Erro na Serverless Function:', error)
    return res.status(500).json({ error: error.message || 'Erro ao processar dados' })
  }
}
