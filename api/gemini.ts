import type { VercelRequest, VercelResponse } from '@vercel/node'
import process from 'process'

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[]
    }
  }[]
  error?: {
    code?: number
    message?: string
    status?: string
  }
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

class GeminiHttpError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'GeminiHttpError'
    this.status = status
  }
}

const cleanJsonText = (text: string): string => {
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

const isRetryableStatus = (status: number): boolean => {
  return status === 503 || status === 429 || status === 500 || status === 504
}

// Timeout de 35s por modelo (dá margem ao thinking sem travar o limite da Vercel)
const FETCH_TIMEOUT_MS = 35000

const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeoutMs = FETCH_TIMEOUT_MS,
): Promise<Response> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    })
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new GeminiHttpError(
        `Timeout de ${timeoutMs}ms ao aguardar resposta da API do Gemini`,
        504,
      )
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
  }
}

const callGeminiWithModel = async (
  model: string,
  prompt: string,
  apiKey: string,
): Promise<string> => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      thinkingConfig: {
        thinkingLevel: 'LOW', // Reduz a latência
      },
    },
  }

  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(requestBody),
  })

  // Se o modelo rejeitar thinkingConfig (ex: modelo que não suporta o parâmetro), tenta sem ele
  if (response.status === 400) {
    const errText = await response.text()
    if (errText.includes('thinkingConfig') || errText.includes('thinking_level')) {
      const fallbackBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }
      const retryResponse = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(fallbackBody),
      })

      if (!retryResponse.ok) {
        const errorBody = await retryResponse.text()
        throw new GeminiHttpError(
          `Erro na API do Gemini (${model} - HTTP ${retryResponse.status}): ${errorBody}`,
          retryResponse.status,
        )
      }

      const retryData = (await retryResponse.json()) as GeminiResponse
      const rawText = retryData.candidates?.[0]?.content?.parts?.[0]?.text
      if (!rawText) {
        throw new Error(`Resposta vazia no modelo ${model}`)
      }
      return rawText
    }

    throw new GeminiHttpError(`Erro na API do Gemini (${model} - HTTP 400): ${errText}`, 400)
  }

  if (!response.ok) {
    const errorBody = await response.text()
    throw new GeminiHttpError(
      `Erro na API do Gemini (${model} - HTTP ${response.status}): ${errorBody}`,
      response.status,
    )
  }

  const data = (await response.json()) as GeminiResponse
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!rawText) {
    throw new Error(`Resposta vazia ou sem candidates no modelo ${model}`)
  }

  return rawText
}

const callGeminiWithFallback = async (prompt: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('A variável GEMINI_API_KEY não foi configurada na Vercel.')
  }

  const configuredModel = process.env.MODEL_NAME?.trim()

  // Modelos ativos suportados atualmente pela API
  const candidateModels = Array.from(
    new Set(
      [configuredModel, 'gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-4-hydrogen'].filter(
        (m): m is string => Boolean(m),
      ),
    ),
  )

  let lastError: unknown = null

  for (let i = 0; i < candidateModels.length; i++) {
    const model = candidateModels[i]
    const nextModel = candidateModels[i + 1]

    try {
      console.log(`[Gemini] Tentando modelo: ${model}`)
      const rawText = await callGeminiWithModel(model, prompt, apiKey)
      console.log(`[Gemini] Sucesso com o modelo: ${model}`)
      return rawText
    } catch (err: unknown) {
      lastError = err
      const status = err instanceof GeminiHttpError ? err.status : 500
      const message = err instanceof Error ? err.message : String(err)

      if (nextModel) {
        console.warn(
          `[Gemini Fallback] Modelo ${model} falhou (status ${status}): ${message}. Acionando fallback para ${nextModel}...`,
        )
      } else {
        console.error(
          `[Gemini] Modelo final ${model} falhou (status ${status}): ${message}. Todos os modelos da lista falharam.`,
        )
      }
    }
  }

  if (lastError instanceof Error) {
    throw lastError
  }

  throw new Error('Não foi possível obter resposta de nenhum modelo do Gemini.')
}

// Handler padrão das Serverless Functions da Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'O prompt é obrigatório' })
    }

    const rawText = await callGeminiWithFallback(prompt)
    const cleanedText = cleanJsonText(rawText)
    const insightData: InsightData = JSON.parse(cleanedText)

    return res.status(200).json(insightData)
  } catch (error: unknown) {
    console.error('Erro na Serverless Function:', error)
    const status =
      error instanceof GeminiHttpError && isRetryableStatus(error.status) ? error.status : 500
    const message = error instanceof Error ? error.message : 'Erro ao processar dados com o Gemini'

    return res.status(status).json({
      error: message,
    })
  }
}
