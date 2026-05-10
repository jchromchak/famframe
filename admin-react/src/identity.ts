import type {
  Account,
  DeviceTarget,
  Family,
  FamilyMember,
  Membership,
} from "./mockData";

export function familiesForAccount(account: Account, families: Family[], memberships: Membership[]) {
  if (account.isSuperAdmin) {
    return families;
  }

  return families.filter((family) =>
    memberships.some((membership) => membership.accountEmail === account.email && membership.familyId === family.id),
  );
}

export function devicesForFamily(familyId: string, deviceTargets: DeviceTarget[]) {
  return deviceTargets.filter((device) => device.familyId === familyId);
}

export function membersForFamily(familyId: string, familyMembers: FamilyMember[]) {
  return familyMembers.filter((member) => member.familyId === familyId);
}

export function roleForAccount(account: Account, familyId: string, memberships: Membership[]) {
  return memberships.find(
    (membership) => membership.accountEmail === account.email && membership.familyId === familyId,
  )?.role;
}
