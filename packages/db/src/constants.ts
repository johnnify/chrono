export const authProviderIds = ['google'] as const
export type AuthProviderId = (typeof authProviderIds)[number]
