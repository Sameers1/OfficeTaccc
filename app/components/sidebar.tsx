"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  ClipboardList,
  BarChart2,
  Settings,
  Users,
  LogOut,
} from "lucide-react"
import { useAuth } from "../context/auth-context"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "My Tasks",
    icon: ClipboardList,
    href: "/my-tasks",
  },
  {
    label: "Team",
    icon: Users,
    href: "/team",
  },
  {
    label: "Reports",
    icon: BarChart2,
    href: "/reports",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="flex h-full flex-col gap-y-4 bg-white border-r">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-x-2">
          <h1 className="text-xl font-bold">TaskFlow</h1>
        </Link>
      </div>
      <div className="flex-1 space-y-2 px-2">
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-x-2",
                pathname === route.href && "bg-gray-100"
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Button>
          </Link>
        ))}
      </div>
      <div className="p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => logout()}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
} 