import { baseApiClient, BaseClient } from '@/api/baseClient'

const SLUG = '/sessions'

const urls = {
  total: `${SLUG}/total`,
}

export class SessionsService {
  private static instance: SessionsService | null = null

  private constructor(private api: BaseClient) {}

  static getInstance(): SessionsService {
    if (!SessionsService.instance) {
      SessionsService.instance = new SessionsService(baseApiClient)
    }
    return SessionsService.instance
  }

  getTotal = async () => {
    const res = await this.api.get<{ total: number }>(urls.total)
    return res.data
  }
}

export default SessionsService.getInstance()
