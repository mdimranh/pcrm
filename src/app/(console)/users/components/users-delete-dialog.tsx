'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { toast } from 'sonner'
import { Users } from '@/app/api/users/route'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Users
  onSuccess?: () => void
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: UserDeleteDialogProps) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDelete = () => {
    if (value.trim() !== currentRow.nid) return
      ; (async () => {
        try {
          setLoading(true)
          const res = await fetch(`/api/users/${currentRow.id}`, { method: 'DELETE' })
          if (!res.ok) throw new Error('Failed to delete user')
          toast.success('User Deleted', {
            description:
              `${currentRow.firstName ?? ''} ${currentRow.lastName ?? ''}`.trim() ||
              currentRow.email?.email ||
              currentRow.phoneNumber?.phoneNumber ||
              'The user has been deleted.',
          })
          onSuccess?.()
          onOpenChange(false)
        } catch {
          toast.error('Error', { description: 'Failed to delete user. Please try again.' })
        } finally {
          setLoading(false)
        }
      })()
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.nid}
      isLoading={loading}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Delete User
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete nid-
            <span className='font-bold'>'{currentRow.nid}'</span>?
            <br />
            This action will permanently remove the user with the role of{' '}
            <span className='font-bold'>
              {currentRow.membership.role.name.toUpperCase()}
            </span>{' '}
            from the system. This cannot be undone.
          </p>

          <Label className='my-2'>
            NID:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter NID to confirm deletion.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
