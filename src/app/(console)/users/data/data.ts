import { UserStatus } from '@/core/db/client'
import { Shield, UserCheck, Users, CreditCard } from 'lucide-react'

export const callTypes = new Map<string, string>([
  ['ACTIVE', 'bg-green-200/40 text-green-900 dark:text-green-100 border-green-300'],
  ['REJECTED', 'bg-red-200/40 text-red-900 dark:text-red-100 border-red-300'],
  ['PENDING', 'bg-yellow-200/40 text-yellow-900 dark:text-yellow-100 border-yellow-300'],
  [
    'SUSPENDED',
    'bg-gray-200/40 text-gray-900 dark:text-gray-100 border-gray-300',
  ],
])

export const roles = [
  {
    label: 'Superadmin',
    value: 'superadmin',
    icon: Shield,
  },
  {
    label: 'Admin',
    value: 'admin',
    icon: UserCheck,
  },
  {
    label: 'Manager',
    value: 'manager',
    icon: Users,
  },
  {
    label: 'Cashier',
    value: 'cashier',
    icon: CreditCard,
  },
] as const
