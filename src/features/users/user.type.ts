export type User = {
  id?: string;
  email: string | null;
  username?: string | null;
};

export type CurrentUser = {
  uid : string;
  emai : string ;
  displayName : string ;
}

export type UserState = {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
};