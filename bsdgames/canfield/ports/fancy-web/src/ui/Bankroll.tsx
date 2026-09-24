export interface BankrollProps {
  amount: number
}

export function Bankroll({ amount }: BankrollProps) {
  const sign = amount >= 0 ? '+' : '-'
  const abs = Math.abs(amount)
  const cls = amount >= 0 ? 'positive' : 'negative'
  return (
    <div className={`bankroll ${cls}`} title="Casino chip stack: red ($5), white ($1), blue ($10) — decorative bankroll indicator.">
      <span className="chip red" title="Red chip = $5" />
      <span className="chip white" title="White chip = $1" />
      <span className="chip blue" title="Blue chip = $10" />
      <span>Bankroll: {sign}${abs}</span>
    </div>
  )
}
