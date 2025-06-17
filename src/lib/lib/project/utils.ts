// Example utility functions for the project

/**
 * Format a date to a localized string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Generate a unique project code
 */
export function generateProjectCode(department: string): string {
  const prefix = department.substring(0, 3).toUpperCase()
  const timestamp = Date.now().toString().slice(-6)
  return `${prefix}-${timestamp}`
}

/**
 * Calculate project timeline in days
 */
export function calculateProjectDuration(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
