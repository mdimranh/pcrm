import { Role } from '@/core/db/client'
import { UsersActionDialog } from './users-action-dialog'
import { UsersDeleteDialog } from './users-delete-dialog'
import { UsersInviteDialog } from './users-invite-dialog'
import { useUsers } from './users-provider'
import { UsersSuspendDialog } from './users-suspend-dialog'

export function UsersDialogs({ roles }: { roles?: Role[] }) {
  const { open, setOpen, currentRow, setCurrentRow, refreshUsers } = useUsers()
  return (
    <>
      <UsersActionDialog
        action='add'
        key='user-add'
        open={open === 'add'}
        roles={roles}
        onOpenChange={() => setOpen('add')}
        onSuccess={refreshUsers}
      />

      <UsersInviteDialog
        key='user-invite'
        open={open === 'invite'}
        onOpenChange={() => setOpen('invite')}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`user-edit-${currentRow.id}`}
            action='edit'
            open={open === 'edit'}
            roles={roles}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            onSuccess={refreshUsers}
            currentRow={currentRow}
          />

          <UsersActionDialog
            key={`user-approve-${currentRow.id}`}
            action='approve'
            open={open === 'approve'}
            roles={roles}
            onOpenChange={() => {
              setOpen('approve')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            onSuccess={refreshUsers}
            currentRow={currentRow}
          />

          <UsersDeleteDialog
            key={`user-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            onSuccess={refreshUsers}
            currentRow={currentRow}
          />

          <UsersSuspendDialog
            key={`user-suspend-${currentRow.id}`}
            open={open === 'suspend'}
            onOpenChange={() => {
              setOpen('suspend')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            onSuccess={refreshUsers}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
