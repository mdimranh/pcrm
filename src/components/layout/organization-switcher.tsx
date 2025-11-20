import * as React from 'react'
import { ChevronsUpDown, Plus, Loader2, GalleryVerticalEnd } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { useCurrentUser } from '@/context/current-user-provider'

type TeamSwitcherProps = {
  teams: { id: string; name: string; logo?: React.ElementType; image?: string; plan?: string }[]
  label?: string
  loading?: boolean
}

export function OrganizationSwitcher({ teams, label = "Organizations", loading }: TeamSwitcherProps) {
  const { isMobile } = useSidebar()
  const { user } = useCurrentUser()
  const [activeTeam, setActiveTeam] = React.useState(teams[0] ?? { name: 'Loading...', image: undefined, plan: '' })
  const isLoading = !!loading
  const [imgError, setImgError] = React.useState(false)
  const [switching, setSwitching] = React.useState(false)
  React.useEffect(() => {
    if (teams.length > 0) setActiveTeam(teams.find(t => t.id === user?.session?.activeOrgId) ?? teams[0])
  }, [teams])
  React.useEffect(() => {
    setImgError(false)
  }, [activeTeam])
  async function selectOrg(team: { id: string; name: string; logo?: React.ElementType; image?: string; plan?: string }) {
    setSwitching(true)
    setActiveTeam(team)
    try {
      if (user?.id) {
        const res = await fetch(`/api/auth/switch-org?org=${team.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
        if (res.ok) {
          if (typeof window !== 'undefined') window.location.assign('/')
          return
        }
      }
      if (typeof window !== 'undefined') window.location.reload()
    } catch {
      if (typeof window !== 'undefined') window.location.reload()
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                {isLoading || switching ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : (
                  activeTeam.logo ? <Image src={activeTeam.logo as string} alt={activeTeam.name} width={20} height={20} className='size-8' onError={() => setImgError(true)} /> : (
                    <GalleryVerticalEnd className='size-4 shrink-0' />
                  )
                )}
              </div>
              <div className='grid flex-1 text-start text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {isLoading ? 'Loading...' : activeTeam.name}
                </span>
                {!isLoading && <span className='truncate text-xs'>{activeTeam.plan}</span>}
              </div>
              <ChevronsUpDown className='ms-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-muted-foreground text-xs'>
              {label}
            </DropdownMenuLabel>
            {isLoading ? (
              <div className='p-2 space-y-2'>
                <Skeleton className='h-6 w-full' />
                <Skeleton className='h-6 w-full' />
                <Skeleton className='h-6 w-full' />
              </div>
            ) : teams.length === 0 ? (
              <DropdownMenuLabel className='text-muted-foreground text-xs'>No organizations</DropdownMenuLabel>
            ) : (
              teams.map((team, index) => (
                <DropdownMenuItem
                  key={team.id}
                  onClick={() => !switching && selectOrg(team)}
                  className={`gap-2 p-2 ${switching ? 'opacity-50 pointer-events-none' : ''}`}
                  disabled={switching}
                >
                  <div className='flex size-6 items-center justify-center'>
                    {team.logo ? <Image src={team.logo as string} alt={team.name} width={16} height={16} className='size-6 rounded-sm' onError={() => setImgError(true)} /> : (
                      <GalleryVerticalEnd className='size-4 shrink-0' />
                    )}
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2'>
              <div className='bg-background flex size-6 items-center justify-center rounded-md border'>
                <Plus className='size-4' />
              </div>
              <div className='text-muted-foreground font-medium'>Add Organization</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
