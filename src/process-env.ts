/*
REACT_APP_BACKEND_URL=http://localhost:3000
*/

export abstract class ProcessEnv {
  public static get BACKEND_URL(): string {
    console.log('URL', process.env.REACT_APP_BACKEND_URL)
    // ToDo: Remove dirty hack for production backend
    return process.env.REACT_APP_BACKEND_URL || 'https://172.22.21.2:6006'
  }
}
