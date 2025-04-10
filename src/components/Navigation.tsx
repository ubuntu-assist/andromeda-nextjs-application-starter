'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Shield, User, FileCheck, Store, Settings } from 'lucide-react'
import { useAndromedaStore } from '@/zustand/andromeda'
import { ConnectWallet } from '@/modules/wallet'

interface NavigationItem {
  name: string
  href: string
  icon: React.ElementType
  requiresAuth: boolean
}

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: User, requiresAuth: true },
  {
    name: 'Credentials',
    href: '/credentials',
    icon: FileCheck,
    requiresAuth: true,
  },
  {
    name: 'Marketplace',
    href: '/marketplace',
    icon: Store,
    requiresAuth: false,
  },
  { name: 'Settings', href: '/settings', icon: Settings, requiresAuth: true },
]

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname()
  const { isConnected } = useAndromedaStore()

  return (
    <header className={cn('border-b border-border', className)}>
      <div className='container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center py-3'>
        <div className='flex items-center gap-2 mb-3 sm:mb-0'>
          <Link href='/' className='flex items-center gap-2'>
            <Shield className='w-8 h-8 text-blue-500' />
            <h1 className='text-2xl font-bold'>ChainID</h1>
          </Link>
        </div>

        <div className='flex items-center'>
          <nav className='flex items-center mr-4'>
            <ul className='flex space-x-1'>
              {navigationItems
                .filter((item) => !item.requiresAuth || isConnected)
                .map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                        pathname === item.href
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-primary hover:bg-accent'
                      )}
                    >
                      <item.icon className='w-4 h-4 mr-2' />
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <ConnectWallet />
        </div>
      </div>
    </header>
  )
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <Navigation />
      <main className='flex-1 container mx-auto py-8 px-4'>{children}</main>
    </div>
  )
}
