export function PageLoader({ isHidden }) {
  return (
    <div className={`page-loader${isHidden ? ' page-loader--hidden' : ''}`} aria-hidden="true">
      <span className="page-loader__ring" />
    </div>
  )
}
