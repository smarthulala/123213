export function formatCurrency(
  value: number | string,
  locale = 'en-AU',
  currency = 'AUD'
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(Number(value))
}
