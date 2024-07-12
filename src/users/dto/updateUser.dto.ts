import { UserRoles } from '../userRole.enum';

export class UpdateUserDto {
  id?: number;
  userName?: string;
  password?: string;
  name?: string;
  email?: string;
  roles?: UserRoles[];
}
