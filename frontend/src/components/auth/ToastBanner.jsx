const ToastBanner = ({ toast }) => {
  if (!toast) return null

  return (
    <div className="fixed left-1/2 top-6 z-50 w-[92%] max-w-xl -translate-x-1/2 rounded-full border border-rose-200 bg-white px-6 py-3 text-center text-sm text-slate-700 shadow-lg">
      <span className="font-semibold text-rose-500">Success:</span>{' '}
      <span className="text-xs text-slate-500">{toast.message}</span>
    </div>
  )
}

export default ToastBanner
