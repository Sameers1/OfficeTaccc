"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { NewTaskDialog } from "@/components/new-task-dialog"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function NewTaskButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="default"
          className={cn(
            "relative group",
            "bg-gradient-to-r from-blue-500 to-blue-600",
            "hover:from-blue-600 hover:to-blue-700",
            "text-white shadow-lg",
            "transition-all duration-200",
            "hover:shadow-blue-500/25 hover:shadow-xl",
            "active:scale-95"
          )}
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2 transition-transform group-hover:scale-125" />
          New Task
        </Button>
      </motion.div>
      <NewTaskDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
