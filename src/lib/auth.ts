import { cookies } from 'next/headers';

export type UserRole = 'citizen' | 'authority' | 'admin';

export function getCurrentRole(): UserRole {
  const roleCookie = cookies().get('civiclens-role');
  return (roleCookie?.value as UserRole) || 'citizen';
}

export function getCurrentUserId(): string {
  const role = getCurrentRole();
  return `${role}-1`;
}
