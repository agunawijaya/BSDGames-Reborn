export function HelpPanel() {
  return (
    <div>
      <h4 style={{ color: 'var(--gold)', marginTop: 0 }}>Quick Commands</h4>
      <table className="help-table">
        <thead>
          <tr>
            <th>Command</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style={{ fontFamily: 'monospace' }}>s1 … s4</td><td>Stock → tableau 1–4</td></tr>
          <tr><td style={{ fontFamily: 'monospace' }}>sf</td><td>Stock → foundation</td></tr>
          <tr><td style={{ fontFamily: 'monospace' }}>t1 … t4</td><td>Talon → tableau 1–4</td></tr>
          <tr><td style={{ fontFamily: 'monospace' }}>tf</td><td>Talon → foundation</td></tr>
          <tr><td style={{ fontFamily: 'monospace' }}>12, 13, … 43</td><td>Tableau → tableau (whole pile)</td></tr>
          <tr><td style={{ fontFamily: 'monospace' }}>1f … 4f</td><td>Tableau → foundation</td></tr>
          <tr><td style={{ fontFamily: 'monospace' }}>ht</td><td>Deal 3 cards from hand to talon</td></tr>
          <tr><td style={{ fontFamily: 'monospace' }}>c</td><td>Toggle card counting ON/OFF</td></tr>
          <tr><td style={{ fontFamily: 'monospace' }}>b</td><td>Show betting info</td></tr>
          <tr><td style={{ fontFamily: 'monospace' }}>q</td><td>Quit session</td></tr>
        </tbody>
      </table>

      <h4 style={{ color: 'var(--gold)', marginTop: '1rem' }}>Empty spaces</h4>
      <ul style={{ fontSize: '0.85rem', paddingLeft: '1.25rem', margin: 0 }}>
        <li>An empty tableau accepts a card from the <strong>stock</strong> (<code>s#</code>) any time.</li>
        <li>The <strong>talon</strong> (<code>t#</code>) may fill it only after the stock is empty.</li>
        <li>A tableau pile (<code>##</code>) can <strong>never</strong> move into an empty space.</li>
      </ul>

      <h4 style={{ color: 'var(--gold)', marginTop: '1rem' }}>Shortcuts</h4>
      <ul style={{ fontSize: '0.85rem', paddingLeft: '1.25rem', margin: 0 }}>
        <li><strong>?</strong> — toggle this panel</li>
        <li><strong>u</strong> or <strong>Ctrl+Z</strong> — undo last move (-$5)</li>
        <li><strong>n</strong> — new game (bankroll carries over)</li>
        <li><strong>Double-click</strong> a playable card — send it to a foundation</li>
        <li>Shortcuts are ignored while the command bar has focus</li>
      </ul>
    </div>
  )
}
