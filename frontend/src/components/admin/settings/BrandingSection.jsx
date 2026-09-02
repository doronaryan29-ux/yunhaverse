import { memo } from 'react'

const BrandingSection = ({
  settings,
  loading,
  colorPresets,
  onSettingChange,
  onLogoUpload,
}) => (
  <section className="rounded-xl border border-slate-200 bg-white/90 p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">Branding</h3>
    <p className="mt-1 text-sm text-slate-600">
      Customize what members see on the homepage.
    </p>
    <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-slate-700">App name</span>
          <input
            type="text"
            value={settings.appName}
            onChange={(event) => onSettingChange('appName', event.target.value)}
            disabled={loading}
            className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
          />
        </label>
        <div className="space-y-2 text-sm">
          <span className="font-medium text-slate-700">Upload logo</span>
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="Logo preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[10px] font-semibold text-slate-400">No logo</span>
              )}
            </div>
            <div className="min-w-[160px] flex-1 space-y-1">
              <input
                type="file"
                accept="image/*"
                onChange={onLogoUpload}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
              <span className="text-xs text-slate-500">
                Stored as a data URL for the homepage, navbar, and login.
              </span>
            </div>
          </div>
        </div>
        <label className="space-y-1 text-sm md:col-span-2">
          <span className="font-medium text-slate-700">Homepage headline</span>
          <input
            type="text"
            value={settings.homepageHeadline}
            onChange={(event) => onSettingChange('homepageHeadline', event.target.value)}
            disabled={loading}
            className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
          />
        </label>
        <label className="space-y-1 text-sm md:col-span-2">
          <span className="font-medium text-slate-700">Homepage subheadline</span>
          <input
            type="text"
            value={settings.homepageSubheadline}
            onChange={(event) =>
              onSettingChange('homepageSubheadline', event.target.value)
            }
            disabled={loading}
            className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
          />
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm lg:-ml-2">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">Primary color</span>
            <div className="flex flex-wrap items-center gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onSettingChange('primaryColor', color)}
                  className="h-8 w-8 rounded-full border border-slate-200 transition hover:scale-105"
                  style={{
                    backgroundColor: color,
                    boxShadow:
                      settings.primaryColor === color
                        ? '0 0 0 3px rgba(15, 23, 42, 0.2)'
                        : 'none',
                  }}
                  aria-label={`Select ${color}`}
                />
              ))}
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(event) => onSettingChange('primaryColor', event.target.value)}
                disabled={loading}
                className="h-10 w-16 rounded-full border border-slate-200"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Homepage Preview
            </p>
            <div className="mt-3 space-y-3 rounded-2xl border border-white/70 bg-white/80 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-white">
                  {settings.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt="Logo preview"
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {settings.appName || 'App Name'}
                  </p>
                  <p className="text-[11px] text-slate-500">Fanbase Spotlight</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  {settings.homepageHeadline || 'Homepage headline'}
                </p>
                <p className="text-xs text-slate-600">
                  {settings.homepageSubheadline || 'Homepage subheadline'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  Join Now
                </button>
                <span className="text-[11px] text-slate-500">Preview only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default memo(BrandingSection)
