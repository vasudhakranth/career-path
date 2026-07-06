import axios from 'axios'

// Dynamically set API base URL based on current host
const getApiBase = () => {
  const host = window.location.hostname
  const isLocalhost = host === 'localhost' || host === '127.0.0.1'
  
  if (isLocalhost) {
    return 'http://localhost:8000/api'
  }
  
  // For non-localhost, use the same host but with port 8000
  return `http://${host}:8000/api`
}

const API_BASE = getApiBase()

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
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
export const getProjects = () => api.get('/projects')
export const getDashboard = () => api.get('/dashboard')

// Resume endpoints
export const saveResume = (resumeData) => api.post('/resume', resumeData)
export const getResume = () => api.get('/resume')
export const updateResume = (resumeData) => api.put('/resume', resumeData)
export const deleteResume = () => api.delete('/resume')

// Resume upload (ATS friendly generation)
export const uploadResumeFile = (formData) =>
  api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })


export default api
