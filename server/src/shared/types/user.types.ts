export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
}
