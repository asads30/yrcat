import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    Authorization: localStorage.getItem('init_data')
  }
})

export { api }