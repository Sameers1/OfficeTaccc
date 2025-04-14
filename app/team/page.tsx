"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TeamList } from "@/components/team/team-list"
import { ProtectedRoute } from "@/components/protected-route"

export default function TeamPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground">Manage your team members and their roles.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>

        <TeamList />
      </div>
    </ProtectedRoute>
  )
} 