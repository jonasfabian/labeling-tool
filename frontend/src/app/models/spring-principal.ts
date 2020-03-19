/**
 * principal returned by spring.
 * NOTE: not all fields are defined.
 */
import {User} from './user';

export interface SpringPrincipal {
  authorities: Array<Authority>;
  principal: CustomUserDetails;
}

export interface Authority {
  authority: string;
}

export enum UserGroupRoleRole {
  ADMIN = 'ADMIN', GROUP_ADMIN = 'GROUP_ADMIN', USER = 'USER'
}

export interface UserGroupRole {
  id: number;
  userId: number;
  userGroupId: number;
  role: UserGroupRoleRole;
}

export interface CustomUserDetails {
  authorities: Array<Authority>;
  username: string;
  id: number;
  user: User;
  userGroupRoles: UserGroupRole[];
}
