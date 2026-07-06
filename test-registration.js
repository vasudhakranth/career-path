import axios from 'axios'

const API_BASE = 'http://localhost:8000/api'

const testRegistration = async () => {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Test User',
      email: `testuser${Date.now()}@example.com`,
      password: 'TestPassword123!',
    })
    console.log('Registration successful:', response.data)
    return response.data
  } catch (error) {
    console.error('Registration error:', {
      status: error.response?.status,
      message: error.response?.data?.detail || error.message,
      data: error.response?.data,
    })
    throw error
  }
}

testRegistration()
