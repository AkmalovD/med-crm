import { baseApiClient, BaseClient } from '@/api/baseClient'

export interface Patient {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  birthDate: string | null
  createdAt: string
  updatedAt: string
}

export interface CreatePatientBody {
  fullName: string
  email?: string
  phone?: string
  birthDate?: string
}

const SLUG = '/patients'

const urls = {
  create: SLUG,
  total: `${SLUG}/total`,
}

export class PatientsService {
  private static instance: PatientsService | null = null

  private constructor(private api: BaseClient) {}

  static getInstance(): PatientsService {
    if (!PatientsService.instance) {
      PatientsService.instance = new PatientsService(baseApiClient)
    }
    return PatientsService.instance
  }

  create = async (body: CreatePatientBody) => {
    const res = await this.api.post<Patient>(urls.create, body)
    return res.data
  }

  getTotal = async () => {
    const res = await this.api.get<{ total: number }>(urls.total)
    return res.data
  }
}

export default PatientsService.getInstance()
