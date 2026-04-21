export type TotalSessionsResponse = {
  total: number
}

export async function getTotalSessions(): Promise<TotalSessionsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set")
  }

  const response = await fetch(`${baseUrl}/sessions/total`, {
    method: 'GET',
    headers: { "Content-Type": "application/json" },
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch total sessions: ${response.status}`)
  }

  return response.json() as Promise<TotalSessionsResponse>
}