export default function calculateWorkPeriod(
  start: string,
  end: string
): number {
  const startTime = new Date(start)
  const endTime = new Date(end)

  const timeDiff = endTime.getTime() - startTime.getTime()
  const hours = timeDiff / (1000 * 60 * 60)

  return parseFloat(hours.toFixed(3))
}
