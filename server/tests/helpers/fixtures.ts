export const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

export const TEST_USERS = {
  manager: {
    email: "manager@quest.com",
    password: "password123",
    name: "John Doe",
    role: "Manager",
  },
  member: {
    email: "member@quest.com",
    password: "password123",
    name: "Jane Smith",
    role: "Member",
  },
} as const;
