const parseJsonSafe = async (response) => {
  const raw = await response.text()
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return { message: raw.slice(0, 200) }
  }
}

export const fetchJsonWithFallback = async (baseUrl, path, options) => {
  const primary = `${baseUrl}${path}`
  let response = await fetch(primary, options)
  if (response.status === 404 && !path.startsWith('/api/')) {
    response = await fetch(`${baseUrl}/api${path}`, options)
  }
  const data = await parseJsonSafe(response)
  return { response, data }
}

