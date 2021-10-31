/*
REACT_APP_BACKEND_URL=http://localhost:3000
*/

export abstract class ProcessEnv {
  public static get BACKEND_URL(): string {
    return process.env.REACT_APP_BACKEND_URL || ''
  }
}
