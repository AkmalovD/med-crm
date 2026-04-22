export type CreatePatientRequest = {
  fullName: string
  email?: string
  phone?: string
  birthDate?: string
}

export type PatientResponse = {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  birthDate: string | null
  createdAt: string
  updatedAt: string
}

export async function CreatePatient(payload: CreatePatientRequest): Promise<PatientResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_KEY_URL

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set")
  }

  const response = await fetch(`${baseUrl}/patients`, {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create patient (${response.status}): ${text}`);
  }
  
  return response.json() as Promise<PatientResponse>;
}