import { AuthData } from './auth-data.model';
import { User } from './user.model';

export interface SignUpResponse {
  user: User;
  auth_data: AuthData;
}
