export type User = {
  userid?: string;
  email: string | null;
  username?: string | null;
};


export type UserState = {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
};