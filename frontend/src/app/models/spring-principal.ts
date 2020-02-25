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

export interface CustomUserDetails {
  authorities: Array<Authority>;
  username: string;
  id: number;
  user: User;
}
