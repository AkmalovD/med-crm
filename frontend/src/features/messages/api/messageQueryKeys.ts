export const MESSAGE_KEYS = {
  all: ['messages'] as const,
  conversations: ['messages', 'conversations'] as const,
  conversationList: (filters: object) => ['messages', 'conversations', filters] as const,
  conversation: (id: string) => ['messages', 'conversation', id] as const,
  messages: (conversationId: string) => ['messages', 'list', conversationId] as const,
}
