import { useContext } from 'react'
import { SettingsContext } from '../context/settingsContextInstance'

export const useAppSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useAppSettings must be used within SettingsProvider')
  }
  return context
}
