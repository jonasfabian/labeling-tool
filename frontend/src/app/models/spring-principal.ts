/**
 * principal returned by spring.
 * NOTE: not all fields are defined.
 */
export interface SpringPrincipal {
  authorities: Array<Authority>;
  principal: Principal;
}

export interface Authority {
  authority: string;
}

export interface Principal {
  authorities: Array<Authority>;
  username: string;
  id: number;
}
