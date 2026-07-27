import type { InsightData } from '../../api/gemini.ts'

export const getInsight = async (prompt: string): Promise<InsightData> => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar insghts no servidor')
  }

  const result = await response.json()
  return result
}
