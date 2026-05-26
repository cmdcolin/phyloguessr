export default function SkipButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="nav-icon-btn" onClick={onClick} title="Skip">
      <span className="nav-icon-btn-label">Skip</span> →
    </button>
  )
}
