'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { type User } from "../data/schema";

type UsersSuspendDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: User
    currentRow?: User
    onSuccess?: () => void
}

export function UsersSuspendDialog({
    open,
    onOpenChange,
    user,
    currentRow,
    onSuccess,
}: UsersSuspendDialogProps) {
    const u = (user ?? currentRow) as User
    const [loading, setLoading] = useState(false)
    const [notes, setNotes] = useState('')

    const handleSuspend = async () => {
        if (!u?.id) return
        if (!notes.trim()) {
            toast.error('Note is required')
            return
        }
        setLoading(true)
        try {
            const res = await fetch(`/api/users/${u.id}/suspend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes }),
            })
            if (!res.ok) throw new Error('Failed to suspend user')
            toast.success('User Suspended', {
                description:
                    `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() ||
                    u.email ||
                    u.phoneNumber ||
                    'The user has been suspended.',
            })
            onSuccess?.()
            onOpenChange(false)
        } catch {
            toast.error('Error', {
                description: 'Failed to suspend user. Please try again.',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-[520px]'>
                <DialogHeader className='text-start'>
                    <DialogTitle>Suspend User</DialogTitle>
                    <DialogDescription>
                        Add a note explaining the reason for suspension.
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label className='text-xs text-muted-foreground'>Name</Label>
                            <p className='font-medium'>
                                {`${u?.firstName ?? ''} ${u?.lastName ?? ''}`.trim() || '—'}
                            </p>
                        </div>
                        <div>
                            <Label className='text-xs text-muted-foreground'>Email / Phone Number</Label>
                            <p className='font-medium'>
                                {u?.email || u?.phoneNumber || '—'}
                            </p>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='suspend-notes'>Note</Label>
                        <Textarea
                            id='suspend-notes'
                            placeholder='Provide the reason for suspension'
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant='outline'
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='destructive'
                        onClick={handleSuspend}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Processing...
                            </>
                        ) : (
                            <>Suspend</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}