export const queryKeys = {
  users: ['users'] as const,
  getUserById: (id: string) => ['users', id] as const,
  sessionsTotal: ['sessions', 'total'] as const
}