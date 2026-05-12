export type Account = {
  email: string;
  displayName: string;
  isSuperAdmin: boolean;
};

export type FamilyRole = "member" | "maintainer" | "co-owner" | "owner";

export type Family = {
  id: string;
  name: string;
  handle: string;
  timezone?: string;
};

export type FamilyMember = {
  id: string;
  familyId: string;
  name: string;
  email?: string;
  relationship: string;
};

export type Membership = {
  accountEmail: string;
  familyId: string;
  familyMemberId: string;
  role: FamilyRole;
};

export type DeviceTarget = {
  id: string;
  familyId: string;
  handle: string;
  label: string;
  surface: "tv" | "tablet" | "phone";
  room: string;
  mode: string;
};

export const accounts: Account[] = [
  {
    email: "jchromchak@gmail.com",
    displayName: "John",
    isSuperAdmin: true,
  },
  {
    email: "owner@example.xyz",
    displayName: "Example Owner",
    isSuperAdmin: false,
  },
  {
    email: "helper@example.test",
    displayName: "Helper",
    isSuperAdmin: false,
  },
];

export const families: Family[] = [
  {
    id: "fam-smith-a1b2c3d4",
    name: "Chromchak Family",
    handle: "chromchak-family-a1b2c3d4",
    timezone: "America/New_York",
  },
  {
    id: "fam-test-9f8e7d6c",
    name: "Test Family",
    handle: "test-family-9f8e7d6c",
    timezone: "America/New_York",
  },
];

export const familyMembers: FamilyMember[] = [
  {
    id: "mem-john",
    familyId: "fam-smith-a1b2c3d4",
    name: "John",
    email: "jchromchak@gmail.com",
    relationship: "Parent",
  },
  {
    id: "mem-example-owner",
    familyId: "fam-smith-a1b2c3d4",
    name: "Example Owner",
    email: "owner@example.xyz",
    relationship: "Parent",
  },
  {
    id: "mem-child-a",
    familyId: "fam-smith-a1b2c3d4",
    name: "Ada",
    relationship: "Kid",
  },
  {
    id: "mem-child-b",
    familyId: "fam-smith-a1b2c3d4",
    name: "Jack",
    relationship: "Kid",
  },
  {
    id: "mem-test-owner",
    familyId: "fam-test-9f8e7d6c",
    name: "Example Owner",
    email: "owner@example.xyz",
    relationship: "Tester",
  },
  {
    id: "mem-helper",
    familyId: "fam-test-9f8e7d6c",
    name: "Helper",
    email: "helper@example.test",
    relationship: "Tester",
  },
];

export const memberships: Membership[] = [
  {
    accountEmail: "jchromchak@gmail.com",
    familyId: "fam-smith-a1b2c3d4",
    familyMemberId: "mem-john",
    role: "owner",
  },
  {
    accountEmail: "owner@example.xyz",
    familyId: "fam-smith-a1b2c3d4",
    familyMemberId: "mem-example-owner",
    role: "co-owner",
  },
  {
    accountEmail: "owner@example.xyz",
    familyId: "fam-test-9f8e7d6c",
    familyMemberId: "mem-test-owner",
    role: "owner",
  },
  {
    accountEmail: "helper@example.test",
    familyId: "fam-test-9f8e7d6c",
    familyMemberId: "mem-helper",
    role: "maintainer",
  },
];

export const deviceTargets: DeviceTarget[] = [
  {
    id: "dev-living-room-tv",
    familyId: "fam-smith-a1b2c3d4",
    handle: "living-room-tv",
    label: "Living Room TV",
    surface: "tv",
    room: "Living Room",
    mode: "Household dashboard",
  },
  {
    id: "dev-family-room-tv",
    familyId: "fam-smith-a1b2c3d4",
    handle: "family-room-tv",
    label: "Family Room TV",
    surface: "tv",
    room: "Family Room",
    mode: "Kid-forward dashboard",
  },
  {
    id: "dev-kitchen-ipad",
    familyId: "fam-smith-a1b2c3d4",
    handle: "kitchen-ipad",
    label: "Kitchen iPad",
    surface: "tablet",
    room: "Kitchen",
    mode: "Capture and prep",
  },
  {
    id: "dev-test-tv",
    familyId: "fam-test-9f8e7d6c",
    handle: "test-tv",
    label: "Test TV",
    surface: "tv",
    room: "Lab",
    mode: "Testing view",
  },
];
