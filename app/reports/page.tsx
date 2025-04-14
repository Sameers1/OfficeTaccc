"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Printer, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function ReportsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Reports</h1>
          <p className="text-muted-foreground">Generate and view reports on team performance and task completion</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Report Parameters</CardTitle>
            <CardDescription>Configure report settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select defaultValue="task-completion">
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task-completion">Task Completion</SelectItem>
                    <SelectItem value="team-performance">Team Performance</SelectItem>
                    <SelectItem value="task-distribution">Task Distribution</SelectItem>
                    <SelectItem value="time-tracking">Time Tracking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-range">Date Range</Label>
                <Select defaultValue="this-month">
                  <SelectTrigger id="date-range">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-member">Team Member</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="team-member">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    <SelectItem value="john">John Smith</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="emily">Emily Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full mt-4">Generate Report</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-none shadow-md">
          <CardHeader>
            <CardTitle>Task Completion Report</CardTitle>
            <CardDescription>Task completion statistics for the current month</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart">
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              <TabsContent value="chart">
                <div className="h-[400px] rounded-md border border-dashed flex items-center justify-center">
                  <p className="text-muted-foreground">Task completion chart visualization would appear here</p>
                </div>
              </TabsContent>
              <TabsContent value="table">
                <div className="h-[400px] rounded-md border border-dashed flex items-center justify-center">
                  <p className="text-muted-foreground">Task completion data table would appear here</p>
                </div>
              </TabsContent>
              <TabsContent value="summary">
                <div className="h-[400px] rounded-md border border-dashed flex items-center justify-center">
                  <p className="text-muted-foreground">Task completion summary statistics would appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] rounded-md border border-dashed flex items-center justify-center">
            <p className="text-muted-foreground">List of recent reports would appear here</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
