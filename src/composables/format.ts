/** CHF-Format nach Schweizer Schreibweise: 1’234.50 */
export function chf(x: number, stellen = 2): string {
  const s = Math.abs(x).toFixed(stellen)
  const [ganz, dez] = s.split('.')
  const mitTrenner = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, '’')
  return (x < 0 ? '−' : '') + mitTrenner + (dez ? '.' + dez : '')
}

export function quote(x: number): string {
  return x.toFixed(2)
}

export function prozent(x: number, stellen = 0): string {
  return (x * 100).toFixed(stellen) + ' %'
}
