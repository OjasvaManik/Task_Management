"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Check, Loader2 } from "lucide-react"
import clsx from "clsx"
import axios from "axios"

// Define types based on your API response
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
}

type GroupListProps = {
    onSelectionChange: (selected: GroupResponse | null) => void
    selectedGroup?: GroupResponse | null
    label?: string
}

export function GroupList({ onSelectionChange, selectedGroup = null, label = "Select Group" }: GroupListProps) {
    const [open, setOpen] = useState(false)
    const [groups, setGroups] = useState<GroupResponse[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()

    useEffect(() => {
        fetchGroups()
    }, [user])

    const fetchGroups = async () => {
        if (!user?.jwt || !user?.organisationId) return

        setLoading(true)
        setError(null)

        try {
            const organisationId = user.organisationId

            const response = await axios.get<GroupResponse[]>(
                `http://localhost:8080/api/v1/group/${organisationId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${user.jwt}`
                    }
                }
            )

            setGroups(response.data)
        } catch (error) {
            console.error("Error fetching groups:", error)

            const errorMessage = error.response?.data?.message ||
                "Failed to fetch groups. Please try again."

            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const selectGroup = (group: GroupResponse) => {
        // If the selected group is the same as the current one, toggle it off
        if (selectedGroup && selectedGroup.groupId === group.groupId) {
            onSelectionChange(null)
        } else {
            onSelectionChange(group)
        }
        setOpen(false)
    }

    return (
        <div className="flex items-center space-x-4 w-full">
            <p className="text-sm text-muted-foreground">{label}</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="text-white button">
                        {selectedGroup
                            ? selectedGroup.groupTitle
                            : "+ Select group"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-80 bg-black" side="right" align="start">
                    <Command className="bg-black">
                        <CommandInput placeholder="Search groups..." />
                        <CommandList>
                            {loading && (
                                <div className="py-6 text-center text-sm text-white flex items-center justify-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading groups...
                                </div>
                            )}
                            {error && (
                                <div className="py-6 text-center text-sm text-red-500">{error}</div>
                            )}
                            <CommandEmpty className="py-6 text-center text-sm text-white">No groups found.</CommandEmpty>
                            <CommandGroup className="text-white">
                                {groups.map((group) => (
                                    <CommandItem
                                        key={group.groupId}
                                        value={group.groupTitle}
                                        onSelect={() => selectGroup(group)}
                                    >
                                        <Check
                                            className={clsx(
                                                "mr-2 h-4 w-4",
                                                selectedGroup?.groupId === group.groupId
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        <div className="flex flex-col">
                                            <span>{group.groupTitle}</span>
                                            <span className="text-xs text-gray-400 truncate max-w-[200px]">
                                                {group.groupDescription}
                                            </span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

// Export a view-only component for displaying all groups in a page
export function GetAllGroups() {
    const [groups, setGroups] = useState<GroupResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const { user } = useAuth()

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

            const response = await axios.get<GroupResponse[]>(
                `http://localhost:8080/api/v1/group/${organisationId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${user.jwt}`
                    }
                }
            )

            setGroups(response.data)
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

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">All Groups</h2>
                <Button
                    onClick={refreshGroups}
                    variant="outline"
                    className="text-white"
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

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
            ) : error ? (
                <div className="p-6 bg-black border border-red-400 rounded-lg">
                    <p className="text-red-400">{error}</p>
                    <Button
                        onClick={refreshGroups}
                        className="mt-4"
                    >
                        Try Again
                    </Button>
                </div>
            ) : groups.length === 0 ? (
                <div className="p-6 bg-black border border-gray-700 rounded-lg text-center">
                    <p className="text-white mb-4">No groups found.</p>
                    <p className="text-gray-400">Create a new group to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.map((group) => (
                        <div key={group.groupId} className="p-4 bg-black border border-gray-700 rounded-lg hover:border-blue-500 transition-colors">
                            <h3 className="text-lg font-medium text-white mb-2">{group.groupTitle}</h3>
                            <p className="text-gray-300 text-sm mb-2">Created by: {group.createdBy}</p>
                            <p className="text-white mb-4">{group.groupDescription}</p>

                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-300 mb-2">Assigned to:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {group.assignedTo.map((user) => (
                                        <span key={user.userId} className="px-2 py-1 bg-gray-800 text-white text-xs rounded-full">
                                            {user.name || user.userName}
                                        </span>
                                    ))}
                                    {group.assignedTo.length === 0 && (
                                        <span className="text-gray-400 text-sm">No users assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}