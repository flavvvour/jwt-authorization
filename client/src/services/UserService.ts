import $api from "../http";
import { IUser } from "../model/IUser";

export default class UserService {
  static fetchUsers() {
    return $api.get<IUser[]>("/users");
  }
}
