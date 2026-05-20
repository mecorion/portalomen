type CsvCell = string | number | boolean | null | undefined

export function useCsvExport() {
  function escapeCell(cell: CsvCell): string {
    const value = cell ?? ''
    const stringValue = String(value).replace(/"/g, '""')

    return `"${stringValue}"`
  }

  function exportToCsv(
    filename: string,
    headers: string[],
    rows: CsvCell[][]
  ) {
    const csvContent = [
      headers,
      ...rows
    ]
      .map((row) => row.map(escapeCell).join(';'))
      .join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;'
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = filename
    link.click()

    URL.revokeObjectURL(url)
  }

  return {
    exportToCsv
  }
}