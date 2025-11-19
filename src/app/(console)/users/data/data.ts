import { UserStatus } from '@/core/db/client'
import { Shield, UserCheck, Users, CreditCard } from 'lucide-react'

export const callTypes = new Map<string, string>([
  ['ACTIVE', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['REJECTED', 'bg-neutral-300/40 border-neutral-300'],
  ['PENDING', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'SUSPENDED',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
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
