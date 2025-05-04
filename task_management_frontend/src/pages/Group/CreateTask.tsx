import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Plus } from "lucide-react"

import { GroupList } from "@/pages/Group/GetAllGroups"

// Updated AssignTaskRequest to include organisationName
type AssignGroupRequest = {
    userName: string
    organisationName: string
}

type TaskCreateResponse = {
    taskId: string
    taskTitle: string
    taskDescription: string
    dueDate: string
    createdBy: string
    groupId: string
    status: string
    organisationId: string
}

type TaskCardData = {
    id: string;
    title: string;
    description: string;
    dueDate?: string;
}

type GroupResponse = {
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
import { useAuth } from "@/context/AuthContext.tsx"
import { toast } from "sonner" // Assuming you have a toast component

const TaskCard = ({ taskData, onUpdate, onDelete, index }) => {
    const [title, setTitle] = useState(taskData.title)
    const [description, setDescription] = useState(taskData.description)
    const [dueDate, setDueDate] = useState(taskData.dueDate || '')

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
        onUpdate(index, { ...taskData, title: e.target.value })
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
        onUpdate(index, { ...taskData, description: e.target.value })
    }

    const handleDueDateChange = (e) => {
        setDueDate(e.target.value)
        onUpdate(index, { ...taskData, dueDate: e.target.value })
    }

    return (
        <Card className="boxes mb-4">
            <CardHeader>
                <CardTitle className="text-white">Task {index + 1}</CardTitle>
                <CardDescription className="text-white">Define task details</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label className="text-white" htmlFor={`title-${index}`}>Title</Label>
                        <Input
                            className="text-white border-0"
                            id={`title-${index}`}
                            placeholder="Title of your task"
                            value={title}
                            onChange={handleTitleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label className="text-white" htmlFor={`description-${index}`}>Description</Label>
                        <Textarea
                            className="text-white border-0"
                            id={`description-${index}`}
                            placeholder="Brief description of the task."
                            value={description}
                            onChange={handleDescriptionChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label className="text-white" htmlFor={`dueDate-${index}`}>Due Date</Label>
                        <Input
                            className="text-white border-0"
                            id={`dueDate-${index}`}
                            type="datetime-local"
                            value={dueDate}
                            onChange={handleDueDateChange}
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button
                    variant="destructive"
                    type="button"
                    className="text-white"
                    onClick={() => onDelete(index)}
                >
                    Remove Task
                </Button>
            </CardFooter>
        </Card>
    )
}

export default function CreateTask() {
    const [tasks, setTasks] = useState<TaskCardData[]>([{
        id: Date.now().toString(),
        title: "",
        description: "",
        dueDate: ""
    }])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedParentGroup, setSelectedParentGroup] = useState<GroupResponse | null>(null)

    const { user } = useAuth()

    const addNewTask = () => {
        setTasks([...tasks, {
            id: Date.now().toString(),
            title: "",
            description: "",
            dueDate: ""
        }])
    }

    const updateTask = (index: number, updatedTask: TaskCardData) => {
        const updatedTasks = [...tasks]
        updatedTasks[index] = updatedTask
        setTasks(updatedTasks)
    }

    const deleteTask = (index: number) => {
        if (tasks.length > 1) {
            const updatedTasks = [...tasks]
            updatedTasks.splice(index, 1)
            setTasks(updatedTasks)
        } else {
            toast("Cannot delete", {
                description: "You must have at least one task.",
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Check if parent group is selected
        if (!selectedParentGroup) {
            toast("Validation Error", {
                description: "Please select a parent group for these tasks.",
            })
            return
        }

        // Check if any task has empty fields
        const hasEmptyFields = tasks.some(task =>
            !task.title.trim() || !task.description.trim()
        )

        if (hasEmptyFields) {
            toast("Validation Error", {
                description: "All tasks must have a title and description.",
            })
            return
        }

        if (!user?.organisationName || !user?.userName) {
            toast("Error", {
                description: "User information is missing. Please try logging in again.",
            })
            return
        }

        setIsSubmitting(true)

        try {
            // Create tasks API request
            const taskPayloads = tasks.map(task => ({
                groupId: selectedParentGroup.groupId,
                taskTitle: task.title,
                taskDescription: task.description,
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : new Date().toISOString(),
                createdBy: user.userName
            }))

            console.log("Sending payload:", JSON.stringify(taskPayloads, null, 2))

            const response = await axios.post<TaskCreateResponse[]>(
                "http://localhost:8080/api/v1/task/create",
                taskPayloads,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.jwt}`
                    }
                }
            )

            console.log("Tasks created:", response.data)

            // Show success toast
            toast("Success!", {
                description: `${response.data.length} tasks created successfully`,
            })

            resetForm()
            setIsOpen(false) // Close the drawer after successful creation
        } catch (error) {
            console.error("Error creating tasks:", error)

            // Show detailed error message if available
            const errorMessage = error.response?.data?.message ||
                "Failed to create tasks. Please try again.";

            // Show error toast
            toast("Error", {
                description: errorMessage,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setTasks([{
            id: Date.now().toString(),
            title: "",
            description: "",
            dueDate: ""
        }])
        setSelectedParentGroup(null)
    }

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <span>Create Tasks</span>
            </DrawerTrigger>
            <DrawerContent className="boxes">
                <div className="mx-auto w-full max-w-3xl">
                    <DrawerHeader>
                        <DrawerTitle className="text-white">Create Multiple Tasks</DrawerTitle>
                        <DrawerDescription className="text-white">Add tasks to the same group</DrawerDescription>
                    </DrawerHeader>

                    <form id="createTasksForm" onSubmit={handleSubmit} className="flex flex-col h-[70vh]">
                        <div className="px-4 md:px-6 mb-4">
                            <GroupList
                                onSelectionChange={(group) => setSelectedParentGroup(group)}
                                selectedGroup={selectedParentGroup}
                                label="Parent Group"
                            />
                            {!selectedParentGroup && (
                                <p className="text-amber-400 text-sm mt-2">
                                    Select a parent group for all tasks
                                </p>
                            )}
                        </div>

                        {selectedParentGroup && (
                            <Button
                                type="button"
                                onClick={addNewTask}
                                className="w-full mb-4 mx-4 flex items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 transition-colors"
                            >
                                <Plus className="mr-2" />
                                Add Another Task
                            </Button>
                        )}

                        <div className="px-4 md:px-6 space-y-4 flex-grow overflow-y-auto">
                            {selectedParentGroup ? (
                                tasks.map((task, index) => (
                                    <TaskCard
                                        key={task.id}
                                        taskData={task}
                                        onUpdate={updateTask}
                                        onDelete={deleteTask}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <div className="flex items-center justify-center h-40 text-white">
                                    Please select a parent group first
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between p-4 mt-4 sticky bottom-0">
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={resetForm}
                                    className="button text-white"
                                    disabled={isSubmitting}
                                >
                                    Reset All
                                </Button>
                                <DrawerClose asChild>
                                    <Button variant="outline" className="button text-white" disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                </DrawerClose>
                            </div>
                            <Button
                                type="submit"
                                className="button text-white"
                                disabled={!selectedParentGroup || tasks.length === 0 || isSubmitting}
                            >
                                {isSubmitting ? "Creating..." : `Create ${tasks.length} Task${tasks.length > 1 ? 's' : ''}`}
                            </Button>
                        </div>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    )
}