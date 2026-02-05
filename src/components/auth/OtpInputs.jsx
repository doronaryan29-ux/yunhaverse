const OtpInputs = ({ label, helpText, digits, setDigits, inputRefs }) => (
  <div className="space-y-3">
    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
      {label}
    </div>
    <div className="flex flex-wrap gap-2">
      {digits.map((value, index) => (
        <input
          key={`otp-${label}-${index}`}
          type="text"
          inputMode="text"
          maxLength={1}
          value={value}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          onChange={(event) => {
            const next = event.target.value
              .replace(/[^a-zA-Z0-9]/g, '')
              .toUpperCase()
            const updated = [...digits]
            updated[index] = next
            setDigits(updated)
            if (next && inputRefs.current[index + 1]) {
              inputRefs.current[index + 1].focus()
            }
          }}
          onPaste={(event) => {
            const pasted = event.clipboardData
              .getData('text')
              .replace(/[^a-zA-Z0-9]/g, '')
              .toUpperCase()
            if (!pasted) return
            event.preventDefault()
            const updated = [...digits]
            for (let i = 0; i < updated.length; i += 1) {
              updated[i] = pasted[i] || ''
            }
            setDigits(updated)
            const nextIndex = Math.min(pasted.length, updated.length - 1)
            const nextInput = inputRefs.current[nextIndex]
            if (nextInput) {
              nextInput.focus()
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Backspace' && !digits[index]) {
              const prev = inputRefs.current[index - 1]
              if (prev) {
                prev.focus()
              }
            }
          }}
          className="h-12 w-12 rounded-2xl border border-rose-200 bg-white text-center text-lg font-semibold text-slate-700 focus:border-rose-400 focus:outline-none"
          required
        />
      ))}
    </div>
    {helpText && <p className="text-xs text-slate-500">{helpText}</p>}
  </div>
)

export default OtpInputs
