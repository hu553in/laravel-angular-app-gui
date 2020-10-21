import { AuthData } from './auth-data.model';
import { User } from './user.model';

export interface SignInResponse {
  user: User;
  auth_data: AuthData;
}
