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
import { Check } from "lucide-react"
import clsx from "clsx"
import axios from "axios";

type User = {
    userId: string
    userName: string
    name: string
    role: string
    organisationId: string
}

// Updated to include organisationName
type AssignTaskRequest = {
    userName: string
    organisationName: string
}

type UserListProps = {
    onSelectionChange: (selected: AssignTaskRequest[]) => void
}

export function UserList({ onSelectionChange }: UserListProps) {
    const [open, setOpen] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()

    useEffect(() => {
        const fetchUsers = async () => {
            if (!user?.jwt || !user?.organisationId) return;

            setLoading(true)
            setError(null)

            try {
                const response = await axios.get<User[]>(
                    `http://localhost:8080/api/v1/organisation/${user.organisationId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.jwt}`
                        }
                    }
                );

                setUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch users", error);
                setError("Failed to fetch users. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [user]);

    const toggleUser = (user: User) => {
        const exists = selectedUsers.find(u => u.userName === user.userName)
        let updated: User[]
        if (exists) {
            updated = selectedUsers.filter(u => u.userName !== user.userName)
        } else {
            updated = [...selectedUsers, user]
        }
        setSelectedUsers(updated)

        // Transform selected users to include organisationName
        onSelectionChange(updated.map(u => ({
            userName: u.userName,
            organisationName: user?.organisationName // Use the authenticated user's organisation
        })))
    }

    return (
        <div className="flex items-center space-x-4 w-full">
            <p className="text-sm text-muted-foreground">Assign Users</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="text-white button">
                        {selectedUsers.length > 0
                            ? selectedUsers.map(u => u.name).join(", ")
                            : "+ Select users"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-80 bg-black" side="right" align="start">
                    <Command className="bg-black">
                        <CommandInput placeholder="Search users..." />
                        <CommandList>
                            {loading && (
                                <div className="py-6 text-center text-sm text-white">Loading users...</div>
                            )}
                            {error && (
                                <div className="py-6 text-center text-sm text-red-500">{error}</div>
                            )}
                            <CommandEmpty className="py-6 text-center text-sm text-white">No users found.</CommandEmpty>
                            <CommandGroup className="text-white">
                                {users.map((u) => (
                                    <CommandItem
                                        key={u.userName}
                                        value={u.userName}
                                        onSelect={() => toggleUser(u)}
                                    >
                                        <Check
                                            className={clsx(
                                                "mr-2 h-4 w-4",
                                                selectedUsers.some(su => su.userName === u.userName)
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {u.name} ({u.userName})
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