"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import axios from "axios"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useTaskService, TaskResponse } from "@/pages/Group/GetTasks.tsx"
import { TaskStatusDropdown } from "./TaskStatusDropdown"

// Define types based on your API responses
type AssignTaskResponse = {
    userId: string
    userName: string
    name: string
}

type GroupResponse = {
    groupId: string
    groupTitle: string
    groupDescription: string
    organisationName: string
    createdBy: string
    assignedTo: Array<AssignTaskResponse>
    tasks?: TaskResponse[] // Will be populated by the tasks API call
}

export function AllGroups() {
    const [groups, setGroups] = useState<GroupResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()
    const taskService = useTaskService()

    useEffect(() => {
        fetchGroups()
    }, [])

    const fetchGroups = async () => {
        if (!user?.organisationId || !user?.jwt) {
            setError("Authentication required. Please log in again.")
            setLoading(false)
            return
        }

        try {
            const organisationId = user.organisationId

            // Fetch all groups
            const groupsResponse = await axios.get<GroupResponse[]>(
                `http://localhost:8080/api/v1/group/${organisationId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${user.jwt}`
                    }
                }
            )

            // Create an enhanced array of groups with tasks
            const groupsWithTasks = await Promise.all(
                groupsResponse.data.map(async (group) => {
                    try {
                        // Use the TaskService to fetch tasks for each group
                        const tasks = await taskService.fetchTasksByGroup(group.groupId)

                        // Return the group with its tasks
                        return {
                            ...group,
                            tasks: tasks
                        }
                    } catch (error) {
                        console.error(`Error fetching tasks for group ${group.groupId}:`, error)
                        // Return the group without tasks if there was an error
                        return {
                            ...group,
                            tasks: []
                        }
                    }
                })
            )

            setGroups(groupsWithTasks)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching groups:", error)

            const errorMessage = error.response?.data?.message ||
                "Failed to fetch groups. Please try again."

            setError(errorMessage)
            setLoading(false)
        }
    }

    const refreshGroups = () => {
        setLoading(true)
        setError(null)
        fetchGroups()
    }

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return new Intl.DateTimeFormat('default', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date)
        } catch (e) {
            return 'Invalid date'
        }
    }

    const handleTaskStatusChange = async (groupId: string, taskId: string, newStatus: string) => {
        // Update the local state with the new status
        const updatedGroups = groups.map(group => {
            if (group.groupId === groupId && group.tasks) {
                const updatedTasks = group.tasks.map(task => {
                    if (task.taskId === taskId) {
                        return { ...task, status: newStatus }
                    }
                    return task
                })
                return { ...group, tasks: updatedTasks }
            }
            return group
        })

        setGroups(updatedGroups)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6 bg-black border border-red-400 rounded-lg">
                <p className="text-red-400">{error}</p>
                <Button
                    onClick={refreshGroups}
                    className="mt-4"
                >
                    Try Again
                </Button>
            </div>
        )
    }

    if (groups.length === 0) {
        return (
            <div className="p-6 bg-black border border-gray-700 rounded-lg text-center">
                <p className="text-white mb-4">No groups found.</p>
                <p className="text-gray-400">Create a new group to get started.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <Button
                    onClick={refreshGroups}
                    variant="outline"
                    className="text-black"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                        </>
                    ) : "Refresh"}
                </Button>
            </div>

            <Accordion
                type="multiple"
                className="w-full grid grid-cols-1 xl:grid-cols-3 gap-4"
            >
                {groups.map((group) => (
                    <AccordionItem
                        key={group.groupId}
                        value={group.groupId}
                        className="boxes border-0 rounded-lg overflow-hidden"
                    >
                        <AccordionTrigger className="px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                            <div className="flex flex-col items-start text-left">
                                <span className="text-lg font-medium">{group.groupTitle}</span>
                                <span className="text-xs text-gray-400">Created by: {group.createdBy}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-4">
                            <div className="mb-3">
                                <p className="text-white text-sm">{group.groupDescription}</p>

                                <div className="mt-2">
                                    <h4 className="text-xs font-medium text-gray-400 mb-1">Team Members:</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {group.assignedTo.map((user) => (
                                            <span key={user.userId} className="px-2 py-0.5 bg-gray-800 text-white text-xs rounded-full">
                                                {user.name || user.userName}
                                            </span>
                                        ))}
                                        {group.assignedTo.length === 0 && (
                                            <span className="text-gray-400 text-xs">No users assigned</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <h4 className="text-sm font-medium text-white mb-2">Tasks:</h4>
                            {group.tasks && group.tasks.length > 0 ? (
                                <ul className="space-y-2">
                                    {group.tasks.map((task) => (
                                        <li key={task.taskId} className="bg-gray-900 p-2 rounded">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h5 className="text-white font-medium">{task.taskTitle}</h5>
                                                    <p className="text-gray-300 text-sm">{task.taskDescription}</p>
                                                </div>
                                                <TaskStatusDropdown
                                                    taskId={task.taskId}
                                                    initialStatus={task.status}
                                                    onStatusChange={(newStatus) => handleTaskStatusChange(group.groupId, task.taskId, newStatus)}
                                                />
                                            </div>
                                            <div className="mt-2 flex justify-between text-xs text-gray-400">
                                                <span>Due: {formatDate(task.dueDate)}</span>
                                                <span>Created by: {task.createdBy}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 text-sm">No tasks assigned to this group.</p>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}