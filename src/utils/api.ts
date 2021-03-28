import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

class Api {
  public static get<T>(path: string): Promise<T> {
    return this.request<T>(path, 'GET')
  }

  public static post<T>(path: string, data: unknown): Promise<T> {
    return this.request<T>(path, 'POST', data)
  }

  public static put<T>(path: string, data: unknown): Promise<T> {
    return this.request<T>(path, 'PUT', data)
  }

  public static delete<T>(path: string): Promise<T> {
    return this.request<T>(path, 'DELETE')
  }

  private static async request<T>(path: string, method: 'GET' | 'PUT' | 'POST' | 'DELETE', data?: any): Promise<T> {
    const config: AxiosRequestConfig = {
      baseURL: process.env.REACT_APP_BACKEND_URL,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
      method,
      url: path,
    }
    const res: AxiosResponse<T> = await axios.request<T>(config)
    return res.data
  }
}

export default Api
