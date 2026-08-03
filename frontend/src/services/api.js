import axios from 'axios'

// Dynamically set API base URL based on current host
const getApiBase = () => {
  const host = window.location.hostname
  const isLocalhost = host === 'localhost' || host === '127.0.0.1'
  
  if (isLocalhost) {
    // Prefer the backend on port 8000 (default). Fall back to 8001 if needed.
    return 'http://localhost:8000/api'
  }
  
  // For non-localhost, use the same host but with port 8001
  return `http://${host}:8001/api`
}

const API_BASE = getApiBase()

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('edumind_token') || api.defaults.headers.common.Authorization?.replace(/^Bearer\s+/i, '') || ''
  console.log('[API Interceptor] Processing request:', {
    method: config.method,
    url: config.url,
    hasFormData: config.data instanceof FormData,
    tokenPresent: !!token,
    tokenLength: token.length,
  })
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
    console.log('[API Interceptor] Authorization header added:', `Bearer ${token.slice(0, 20)}...`)
  }
  
  // Important: Don't set Content-Type for FormData - let browser set it with boundary
  if (config.data instanceof FormData) {
    console.log('[API Interceptor] FormData detected - removing Content-Type to allow browser to set multipart/form-data')
    delete config.headers['Content-Type']
  }
  
  return config
})

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export const register = (payload) => api.post('/auth/register', payload)
export const login = (payload) => api.post('/auth/login', payload)
export const getCurrentUser = () => api.get('/auth/me')
export const updateSelectedRole = (role_name) => api.put('/auth/me/role', { role_name })
export const updateResumeCompletion = (completion) => api.put('/auth/me/resume', { completion })
export const completeProject = (projectId) => api.post(`/projects/${projectId}/complete`)
export const getRoles = () => api.get('/roles')
export const getRoadmaps = () => api.get('/roadmaps')
export const getRoadmapByRole = (role) => api.get(`/roadmaps/${encodeURIComponent(role)}`)
export const getSkills = () => api.get('/skills')
export const getSkillByName = (skillName) => api.get(`/skills/skill/${encodeURIComponent(skillName)}`)
export const getProjects = () => api.get('/projects')
export const getDashboard = () => api.get('/dashboard')

// Resume endpoints
export const saveResume = (resumeData) => api.post('/resume', resumeData)
export const getResume = () => api.get('/resume')
export const updateResume = (resumeData) => api.put('/resume', resumeData)
export const deleteResume = () => api.delete('/resume')

// Resume upload (ATS friendly generation)
export const uploadResumeFile = (formData) =>
  api.post('/resume/upload', formData)

export const askAi = (payload) => api.post('/ask/', payload)
export const getAskChats = () => api.get('/ask/chats')
export const createAskChat = (payload) => api.post('/ask/chats', payload)
export const updateAskChat = (chatId, payload) => api.put(`/ask/chats/${chatId}`, payload)
export const deleteAskChat = (chatId) => api.delete(`/ask/chats/${chatId}`)

export default api
