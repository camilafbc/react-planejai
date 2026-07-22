export function formatCurrency(value: string): string {
  const sanitizedValue = value.replace(/\D/g, '')

  if (!sanitizedValue) {
    return ''
  }

  const numericValue = Number(sanitizedValue) / 100

  if (isNaN(numericValue)) {
    return ''
  }

  return numericValue.toLocaleString('pt-BR', {
    // style: 'currency',
    // currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/\./g, '').replace(',', '.').replace('R$', '')) || 0
}
