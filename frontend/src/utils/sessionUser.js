export const getSessionUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}
