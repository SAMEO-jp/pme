"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { AddProjectMemberForm } from "./add-project-member-form"

interface AddOtherMemberButtonProps {
  projectId: string
  onSuccess?: () => void
}

export function AddOtherMemberButton({ projectId, onSuccess }: AddOtherMemberButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <UserPlus className="h-4 w-4 mr-2" />
        他のメンバーを追加
      </Button>
      
      <AddProjectMemberForm
        projectId={projectId}
        open={isOpen}
        onOpenChange={setIsOpen}
        onSuccess={handleSuccess}
      />
    </>
  )
} 