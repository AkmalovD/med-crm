import {AuthResponse, AuthUser, LoginDto, RefreshResponse} from "@/types/auth";
import {baseApiClient} from "@/api/baseClient";

export const authApi = {
    login: (dto: LoginDto) =>
        baseApiClient.post<AuthResponse>('/auth/login', dto),

    refresh: (refreshToken: string) =>
        baseApiClient.post<RefreshResponse>('/auth/refresh', null, {
            headers: {Authorization: `Bearer ${refreshToken}`},
        }),

    me: () =>
        baseApiClient.get<AuthUser>('/auth/me')
}