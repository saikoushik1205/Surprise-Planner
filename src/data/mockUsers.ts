export const TEST_ACCOUNT = {
  email: 'test@surpriseplanner.com',
  password: 'Test@1234',
  name: 'Test Planner',
} as const;

export const TEST_CREW_ACCOUNT = {
  email: 'rahul@surpriseplanner.com',
  password: 'Test@1234',
  name: 'Rahul Sharma',
  phone: '+91 98765 43210',
  city: 'Hyderabad',
} as const;

export type MockUserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export const seedMockUsers: MockUserRecord[] = [
  {
    id: 'user_test',
    name: TEST_ACCOUNT.name,
    email: TEST_ACCOUNT.email,
    password: TEST_ACCOUNT.password,
  },
];
