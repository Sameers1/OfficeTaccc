"use client"

import { useState } from "react"
import { Search, Bell, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useSidebar } from "./sidebar-context"

export function Header({ userName = "Admin User" }) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { isCollapsed } = useSidebar()

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white shadow-sm px-6"
    >
      <div className="flex flex-1 items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search tasks, employees..."
            className="h-10 w-full rounded-full border-gray-200 pl-10 pr-4 text-sm focus-visible:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5 text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <HelpCircle className="h-5 w-5 text-gray-500" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8 border border-gray-200">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={userName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">{userName}</span>
                <span className="text-xs text-gray-500">Administrator</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col">
                <span>Profile</span>
                <span className="text-xs text-gray-500">Manage your account</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col">
                <span>Settings</span>
                <span className="text-xs text-gray-500">Preferences & configuration</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}
