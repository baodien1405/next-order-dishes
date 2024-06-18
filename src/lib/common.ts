export const getAccessTokenFromLS = () => localStorage.getItem('accessToken')

export const setAccessTokenToLS = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

export const removeAccessTokenToLS = () => {
  localStorage.removeItem('accessToken')
}

export const getRefreshTokenFromLS = () => localStorage.getItem('refreshToken')

export const setRefreshTokenToLS = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken)
}

export const removeRefreshTokenToLS = () => {
  localStorage.removeItem('refreshToken')
}

export const getUserFromLS = () => localStorage.getItem('user')

export const setUserToLS = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const removeUserToLS = () => {
  localStorage.removeItem('user')
}
