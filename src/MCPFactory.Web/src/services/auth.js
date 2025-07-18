import { api } from './api'

export const authService = {
  async login(credentials) {
    return api.post('/auth/login', credentials)
  },

  async register(userData) {
    return api.post('/auth/register', userData)
  },

  async logout() {
    return api.post('/auth/logout')
  },

  async getProfile() {
    return api.get('/auth/profile')
  },

  async updateProfile(profileData) {
    return api.patch('/auth/profile', profileData)
  },

  async changePassword(passwordData) {
    return api.post('/auth/change-password', passwordData)
  },

  async forgotPassword(email) {
    return api.post('/auth/forgot-password', { email })
  },

  async resetPassword(token, newPassword) {
    return api.post('/auth/reset-password', { token, newPassword })
  },

  async verifyEmail(token) {
    return api.post('/auth/verify-email', { token })
  },

  async resendVerification() {
    return api.post('/auth/resend-verification')
  }
}