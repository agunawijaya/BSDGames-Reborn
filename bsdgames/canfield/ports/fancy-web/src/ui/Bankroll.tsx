export interface BankrollProps {
  amount: number
}

export function Bankroll({ amount }: BankrollProps) {
  const sign = amount >= 0 ? '+' : '-'
  const abs = Math.abs(amount)
  const cls = amount >= 0 ? 'positive' : 'negative'
  return (
    <div className={`bankroll ${cls}`} title="Three casino chips — a decorative indicator of your current bankroll.">
      <span className="chip red" title="Red chip" />
      <span className="chip white" title="White chip" />
      <span className="chip blue" title="Blue chip" />
      <span>Bankroll: {sign}${abs}</span>
    </div>
  )
}
