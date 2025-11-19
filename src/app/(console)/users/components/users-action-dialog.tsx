'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { type User } from '../data/schema'
import { Role } from '@/core/db/client'
import { Users } from '@/app/api/users/route'
import { UnitSelector } from '@/app/auth/signup/components/unit-selector'

const formSchema = z
  .object({
    firstName: z.string().min(1, 'First Name is required.'),
    lastName: z.string().min(1, 'Last Name is required.'),
    phoneNumber: z.string().min(1, 'Phone number is required.'),
    email: z.email({
      error: (iss) => (iss.input === '' ? 'Email is required.' : undefined),
    }),
    nid: z.string().min(1, 'NID is required.'),
    gender: z.string().min(1, 'Gender is required.'),
    designation: z.string().min(1, 'Designation is required.'),
    divisionId: z.string().optional(),
    districtId: z.string().optional(),
    upazilaId: z.string().optional(),
    unionId: z.string().optional(),
    pollingUnitId: z.string().optional(),
    isEdit: z.boolean(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.isEdit) {
      if (!val.password || val.password.length < 7) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required and must be at least 7 characters.',
          path: ['password'],
        })
      }
      if (!val.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Confirm password is required.',
          path: ['confirmPassword'],
        })
      } else if (val.confirmPassword !== val.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Passwords do not match.',
          path: ['confirmPassword'],
        })
      }
    }
  })
type UserForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: Users
  open: boolean
  roles?: Role[]
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  roles,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
        firstName: currentRow?.firstName ?? '',
        lastName: currentRow?.lastName ?? '',
        email: currentRow?.email?.email ?? '',
        phoneNumber: currentRow?.phoneNumber?.phoneNumber ?? '',
        nid: (currentRow as Users)?.nid ?? '',
        gender: (currentRow as Users)?.gender ?? '',
        designation: (currentRow as Users)?.membership?.role?.name ?? '',
        divisionId: (currentRow as Users)?.area?.divisionId ?? undefined,
        districtId: (currentRow as Users)?.area?.districtId ?? undefined,
        upazilaId: (currentRow as Users)?.area?.upazilaId ?? undefined,
        unionId: (currentRow as Users)?.area?.unionId ?? undefined,
        pollingUnitId: (currentRow as Users)?.area?.pollingUnitId ?? undefined,
        isEdit,
      }
      : {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        nid: '',
        gender: '',
        designation: '',
        divisionId: undefined,
        districtId: undefined,
        upazilaId: undefined,
        unionId: undefined,
        pollingUnitId: undefined,
        password: '',
        confirmPassword: '',
        isEdit,
      },
  })

  const onSubmit = (values: UserForm) => {
    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Doe'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john.doe@gmail.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='+123456789'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='nid'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>NID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='National ID'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Gender</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select gender'
                      className='col-span-4 w-full'
                      items={[
                        { label: 'Male', value: 'MALE' },
                        { label: 'Female', value: 'FEMALE' },
                        { label: 'Third Gender', value: 'THIRD_GENDER' },
                      ]}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='designation'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Designation</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select a designation'
                      className='col-span-4 w-full'
                      items={roles?.map(({ name }) => ({
                        label: name,
                        value: name,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {!isEdit && (
                <>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder='••••••••'
                            className='col-span-4'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>Confirm Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder='••••••••'
                            className='col-span-4'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className='px-0.5'>
                <UnitSelector setValue={form.setValue as any} form={form as any} />
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type='submit' form='user-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
