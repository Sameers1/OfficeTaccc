"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  ClipboardList,
  BarChart2,
  Settings,
  Users,
  LogOut,
  Bell,
  Search,
  Menu,
  FileText,
} from "lucide-react"
import { useAuth } from "../app/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

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
    label: "Documents",
    icon: FileText,
    href: "/documents",
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
    <div className="flex h-screen w-64 flex-col bg-gradient-to-b from-[#1a1f2c] via-[#1c2230] to-[#1a1f2c] border-r border-slate-800/50">
      {/* Logo and Menu */}
      <div className="flex items-center justify-between p-5 border-b border-slate-800/50">
        <Link href="/dashboard" className="flex items-center gap-x-2">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-1.5">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            TaskFlow
          </span>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors duration-200" />
          <Input
            placeholder="Quick search..."
            className="w-full pl-9 bg-slate-800/50 border-slate-700/50 text-slate-200 placeholder:text-slate-400 
                     focus-visible:ring-blue-400/30 focus-visible:ring-offset-0 focus-visible:border-blue-400/30
                     hover:bg-slate-800/70 transition-colors duration-200"
          />
        </div>
      </div>

      {/* User Profile */}
      <div className="mt-4 px-4 py-3 mx-3 flex items-center gap-3 bg-slate-800/50 rounded-lg">
        <Avatar className="h-9 w-9 border-2 border-slate-700/50 hover:border-blue-400/50 transition-colors duration-200">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">John Doe</p>
          <p className="text-xs text-slate-400 truncate">Administrator</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-slate-400 hover:text-blue-400 hover:bg-slate-800/70 rounded-lg"
        >
          <Bell className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-x-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200",
                pathname === route.href && 
                "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-white border-r-2 border-blue-400"
              )}
            >
              <route.icon className={cn(
                "h-5 w-5",
                pathname === route.href && "text-blue-400"
              )} />
              {route.label}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 mx-3 mb-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-x-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 
                     rounded-lg transition-all duration-200"
          onClick={() => logout()}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}
