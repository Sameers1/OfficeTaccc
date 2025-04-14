"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "Admin" | "Member" | "Owner"
  avatar?: string
  status: "active" | "inactive"
}

const initialMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "Member",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    status: "active",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Owner",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    status: "active",
  },
]

const roleColors: Record<TeamMember["role"], string> = {
  Admin: "bg-purple-100 text-purple-800",
  Member: "bg-blue-100 text-blue-800",
  Owner: "bg-amber-100 text-amber-800",
}

export function TeamList() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter((member) => member.id !== memberId))
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className={roleColors[member.role]}>
                  {member.role}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>Edit Member</DropdownMenuItem>
                    <DropdownMenuItem>Change Role</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      Remove Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      {members.length === 0 && (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">No team members found</p>
        </div>
      )}
    </div>
  )
} 