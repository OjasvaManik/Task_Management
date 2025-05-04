import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import axios from "axios"

// Updated AssignTaskRequest to include organisationName
type AssignTaskRequest = {
    userName: string
    organisationName: string
}

type GroupCreateResponse = {
    groupId: string
    groupTitle: string
    groupDescription: string
    organisationName: string
    createdBy: string
    assignedTo: Array<{
        userId: string
        userName: string
        name: string
    }>
}

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea.tsx"
import { useState } from "react"
import { UserList } from "@/pages/Group/UserList.tsx"
import { useAuth } from "@/context/AuthContext.tsx"
import { toast } from "sonner" // Assuming you have a toast component

export default function CreateGroup() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [assignedUsers, setAssignedUsers] = useState<AssignTaskRequest[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const { user } = useAuth()

    // Fixed TypeScript error by ensuring we use the organisationName from the auth context
    const handleUserSelectionChange = (selectedUsers: { userName: string }[]) => {
        if (!user?.organisationName) {
            console.error("Organisation name is missing from user context")
            return
        }

        // Map the selected users to include the organisationName from auth context
        const usersWithOrg = selectedUsers.map(selectedUser => ({
            userName: selectedUser.userName,
            organisationName: user.organisationName
        }))

        setAssignedUsers(usersWithOrg)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!title.trim() || !description.trim()) {
            return
        }

        if (!user?.organisationName) {
            toast("Error", {
                description: "Organisation information is missing. Please try logging in again.",
            })
            return
        }

        setIsSubmitting(true)

        const groupPayload = {
            groupTitle: title,
            groupDescription: description,
            organisationName: user.organisationName,
            createdBy: user.userName,
            assignedTo: assignedUsers,
        }

        try {
            console.log("Sending payload:", JSON.stringify(groupPayload, null, 2))

            const response = await axios.post<GroupCreateResponse>(
                "http://localhost:8080/api/v1/group",
                groupPayload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.jwt}`
                    }
                }
            )

            console.log("Group created:", response.data)

            // Show success toast
            toast("Success!", {
                description: `Group "${response.data.groupTitle}" created successfully`,
            })

            resetForm()
            setIsOpen(false) // Close the drawer after successful creation
        } catch (error) {
            console.error("Error creating group:", error)

            // Show detailed error message if available
            const errorMessage = error.response?.data?.message ||
                "Failed to create group. Please try again.";

            // Show error toast
            toast("Error", {
                description: errorMessage,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setAssignedUsers([])
    }

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <span>Create Group</span>
            </DrawerTrigger>
            <DrawerContent className="boxes">
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className="hidden">Create Group to add tasks to.</DrawerTitle>
                        <DrawerDescription className="hidden">Set the name of your Group.</DrawerDescription>
                    </DrawerHeader>
                    <Card className="boxes">
                        <CardHeader>
                            <CardTitle className="text-white">Create group</CardTitle>
                            <CardDescription className="text-white">Deploy your new group for tasks in one-click.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form id="createGroupForm" onSubmit={handleSubmit}>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label className="text-white" htmlFor="title">Title</Label>
                                        <Input
                                            className="text-white border-0"
                                            id="title"
                                            placeholder="Title of your new group"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label className="text-white" htmlFor="description">Description</Label>
                                        <Textarea
                                            className="text-white border-0"
                                            id="description"
                                            placeholder="Brief description of related tasks."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center items-center space-y-1.5">
                                        <UserList onSelectionChange={handleUserSelectionChange} />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={resetForm}
                                className="button text-white"
                                disabled={isSubmitting}
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                form="createGroupForm"
                                className="button text-white"
                                disabled={!title.trim() || !description.trim() || isSubmitting}
                            >
                                {isSubmitting ? "Creating..." : "Create"}
                            </Button>
                        </CardFooter>
                    </Card>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline" className="button text-white" disabled={isSubmitting}>
                                Cancel
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}