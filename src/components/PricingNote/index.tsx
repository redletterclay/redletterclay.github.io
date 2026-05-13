export function PricingNote() {
  return (
    <p
      style={{
        textAlign: 'center',
        fontSize: '1.3rem',
        color: '#8C5C40',
        margin: '0.5rem 0 0',
        letterSpacing: '0.02em',
        fontFamily: 'var(--font-heading2)',
      }}
    >
      <i
        className="fa-solid fa-face-grin-wide"
        style={{ marginRight: '0.4rem', color: '#24A9CA' }}
        aria-hidden="true"
      />
      Simple pricing: All totals include shipping and tax.
    </p>
  )
}
