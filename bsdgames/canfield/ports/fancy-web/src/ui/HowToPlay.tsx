import { RANK_LABELS } from '../game/types'

export interface HowToPlayProps {
  baseRank?: number | null
}

export function HowToPlay({ baseRank }: HowToPlayProps) {
  return (
    <div>
      <p style={{ lineHeight: 1.5 }}>
        <strong>Canfield is not Klondike.</strong> It looks like solitaire,
        but the rules and the betting economy are different. Read this before
        you commit real money to a bad deal.
      </p>

      <h4 style={{ color: 'var(--gold)', marginTop: '1rem' }}>1. The goal</h4>
      <p style={{ lineHeight: 1.5 }}>
        Move all 52 cards to the four foundations. You earn <strong>$5</strong> for
        every card that reaches a foundation.
      </p>

      <h4 style={{ color: 'var(--gold)', marginTop: '1rem' }}>2. The base rank</h4>
      <p style={{ lineHeight: 1.5 }}>
        Unlike Klondike, foundations do <em>not</em> start at Ace. The first card
        dealt to the first foundation — the <strong>base card</strong> — sets the
        rank for all four foundations.
      </p>
      <p style={{ lineHeight: 1.5 }}>
        {baseRank
          ? `In this deal the base rank is ${RANK_LABELS[baseRank as 1]}. Every foundation must start with ${RANK_LABELS[baseRank as 1]}.`
          : 'The base rank is shown on the first foundation pile. Watch it carefully — it changes every deal.'}
      </p>

      <h4 style={{ color: 'var(--gold)', marginTop: '1rem' }}>3. The three betting phases</h4>
      <p style={{ lineHeight: 1.5 }}>
        Canfield is a casino game. You do not start moving cards for free; you pay
        in stages:
      </p>
      <ul style={{ lineHeight: 1.6, paddingLeft: '1.25rem' }}>
        <li>
          <strong>Buy ($13)</strong> — you get the initial deal. At this point you
          can Inspect, Commit, or Quit.
        </li>
        <li>
          <strong>Inspect (+$13)</strong> — unlocks <em>foundation moves only</em>.
          This lets you test whether the base card and the visible cards give you a
          promising path before you risk more money.
        </li>
        <li>
          <strong>Commit (+$26, or +$39 straight from Buy)</strong> — unlocks
          <em> all</em> moves: tableau moves, Deal Hand → Talon, and everything else.
          You are now fully in the game.
        </li>
      </ul>
      <p style={{ lineHeight: 1.5 }}>
        If the deal looks bad after Inspect, you can still Quit and lose only
        <strong>$26</strong> (Buy + Inspect), not the full <strong>$52</strong>.
        If you are already confident, click <strong>Commit</strong> straight from
        Buy to skip the trial and pay $39 total.
      </p>

      <h4 style={{ color: 'var(--gold)', marginTop: '1rem' }}>4. Building rules</h4>
      <ul style={{ lineHeight: 1.6, paddingLeft: '1.25rem' }}>
        <li>
          <strong>Foundations</strong> build upward in the same suit from the base
          rank, and wrap around: …Q, K, <strong>A</strong>, 2, 3…
        </li>
        <li>
          <strong>Tableaus</strong> build downward by alternating color, like
          Klondike: a red 8 can sit on a black 9.
        </li>
        <li>
          When moving <strong>tableau → tableau</strong>, you move the
          <em> entire face-up pile</em> as one unit, not just the top card.
        </li>
        <li>
          An <strong>empty tableau</strong> can only be filled from the stock
          while the stock still has cards. After the stock is exhausted, empty
          spaces may be filled from the talon.
        </li>
      </ul>

      <h4 style={{ color: 'var(--gold)', marginTop: '1rem' }}>5. The hand and talon</h4>
      <p style={{ lineHeight: 1.5 }}>
        Click <strong>Deal Hand → Talon</strong> (or type <code>ht</code>) to draw
        3 cards from the hidden hand onto the talon. Only the top talon card is
        playable. When the hand runs out and you draw again, the talon is recycled
        face-down into the hand — this re-run costs <strong>$5</strong> each time
        after the first cycle.
      </p>

      <h4 style={{ color: 'var(--gold)', marginTop: '1rem' }}>6. The betting economy</h4>
      <p style={{ lineHeight: 1.5 }}>
        You are playing against the casino. Every cost is real:
      </p>
      <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
        <tbody>
          <tr><td style={{ padding: '0.25rem' }}>Initial deal</td><td style={{ padding: '0.25rem' }}>-$13</td></tr>
          <tr><td style={{ padding: '0.25rem' }}>Inspect (foundation moves only)</td><td style={{ padding: '0.25rem' }}>-$13</td></tr>
          <tr><td style={{ padding: '0.25rem' }}>Commit (all moves unlocked)</td><td style={{ padding: '0.25rem' }}>-$26</td></tr>
          <tr><td style={{ padding: '0.25rem' }}>Each re-run through the hand</td><td style={{ padding: '0.25rem' }}>-$5</td></tr>
          <tr><td style={{ padding: '0.25rem' }}>Card counting per unknown card</td><td style={{ padding: '0.25rem' }}>-$1</td></tr>
          <tr><td style={{ padding: '0.25rem' }}>Thinking time (max $3/move)</td><td style={{ padding: '0.25rem' }}>-$1/min</td></tr>
          <tr style={{ borderTop: '1px solid var(--gold)' }}><td style={{ padding: '0.25rem' }}><strong>Card to foundation</strong></td><td style={{ padding: '0.25rem' }}><strong>+$5</strong></td></tr>
        </tbody>
      </table>
      <p style={{ lineHeight: 1.5 }}>
        Break-even is roughly <strong>10–11 cards</strong> on foundations. If the
        deal looks terrible after inspection, quit — you only lose $26, not the
        full $52.
      </p>
      <p style={{ lineHeight: 1.5 }}>
        <strong>Is every deal winnable?</strong> No — Canfield is intentionally
        hard. Some seeds are unwinnable no matter how well you play; the challenge
        is recognizing a bad deal early and cutting your losses.
      </p>

      <h4 style={{ color: 'var(--gold)', marginTop: '1rem' }}>7. How to start a session</h4>
      <ol style={{ lineHeight: 1.6, paddingLeft: '1.25rem' }}>
        <li>Look at the base rank and the visible cards.</li>
        <li>Click <strong>Inspect</strong> to try foundation-only moves cheaply.</li>
        <li>If you see a promising path, click <strong>Commit</strong>.</li>
        <li>Build foundations aggressively — they are the only way to earn money.</li>
        <li>Use <strong>card counting</strong> only when one or two cards stand between you and a big payout.</li>
      </ol>
    </div>
  )
}
