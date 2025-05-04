"use client"

import { useState } from "react"
import { useTaskService } from "@/pages/Group/GetTasks.tsx"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2 } from "lucide-react"

export function TaskStatusDropdown({ taskId, initialStatus, onStatusChange }) {
    const [status, setStatus] = useState(initialStatus)
    const [loading, setLoading] = useState(false)
    const taskService = useTaskService()

    // Define status options and their styling
    const statusOptions = [
        { value: "NOT_STARTED", label: "Not Started", className: "bg-gray-700 hover:bg-gray-600 text-white" },
        { value: "IN_PROGRESS", label: "In Progress", className: "bg-blue-700 hover:bg-blue-600 text-white" },
        { value: "COMPLETED", label: "Completed", className: "bg-green-700 hover:bg-green-600 text-white" },
        { value: "CANCELLED", label: "Cancelled", className: "bg-red-700 hover:bg-red-600 text-white" },
    ]

    // Find the current status option
    const currentStatus = statusOptions.find(option => option.value === status) || statusOptions[0]

    const handleStatusChange = async (newStatus) => {
        if (newStatus === status) return

        setLoading(true)
        try {
            await taskService.setTaskStatus(taskId, newStatus)
            setStatus(newStatus)

            // Call parent callback if provided
            if (onStatusChange) {
                onStatusChange(newStatus)
            }
        } catch (error) {
            console.error("Failed to update task status:", error)
            // Could add error handling/notification here
        } finally {
            setLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={`px-2 py-1 text-xs font-medium ${currentStatus.className} border-0`}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        currentStatus.label
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36">
                {statusOptions.map(option => (
                    <DropdownMenuItem
                        key={option.value}
                        className={`cursor-pointer ${option.value === status ? 'font-bold' : ''}`}
                        onClick={() => handleStatusChange(option.value)}
                    >
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}