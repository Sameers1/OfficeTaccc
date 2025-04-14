"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()

  const handleSaveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully",
    })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Settings</h1>
        <p className="text-muted-foreground">Manage your team preferences and system settings</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
              <CardDescription>Update your team details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input id="team-name" defaultValue="Administrative Team" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-description">Team Description</Label>
                <Textarea
                  id="team-description"
                  defaultValue="Administrative team responsible for managing company operations and tasks."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-email">Team Email</Label>
                <Input id="team-email" type="email" defaultValue="admin@company.com" className="h-10" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Task Settings</CardTitle>
              <CardDescription>Configure default task settings and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-assign">Auto-assign tasks</Label>
                  <p className="text-sm text-muted-foreground">Automatically assign tasks based on workload</p>
                </div>
                <Switch id="auto-assign" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="task-reminders">Task reminders</Label>
                  <p className="text-sm text-muted-foreground">Send email reminders for upcoming deadlines</p>
                </div>
                <Switch id="task-reminders" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="task-history">Keep task history</Label>
                  <p className="text-sm text-muted-foreground">Maintain a history of completed tasks</p>
                </div>
                <Switch id="task-history" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage team members and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border border-dashed p-8 flex items-center justify-center">
                  <p className="text-muted-foreground">Team members management interface would be implemented here</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Add Team Member</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border border-dashed p-8 flex items-center justify-center">
                  <p className="text-muted-foreground">Notification settings interface would be implemented here</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect with other tools and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border border-dashed p-8 flex items-center justify-center">
                  <p className="text-muted-foreground">Integrations interface would be implemented here</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Add Integration</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
