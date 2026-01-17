import $api from "../http";
import { AuthResponse } from "../model/response/AuthResponse";

export default class AuthService {
  static async login(email: string, password: string) {
    return $api.post<AuthResponse>("/login", { email, password });
  }

  static async registration(email: string, password: string) {
    return $api.post<AuthResponse>("/registration", { email, password });
  }

  static async logout() {
    return $api.post("/logout");
  }
}
