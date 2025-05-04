"use client"

import { useAuth } from "@/context/AuthContext"
import axios from "axios"

// Define types based on API responses
export type TaskResponse = {
    taskId: string
    taskTitle: string
    taskDescription: string
    dueDate: string
    createdBy: string
    groupId: string
    status: string
    organisationId: string
}

export type ProgressTypeEnum = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'

export const useTaskService = () => {
    const { user } = useAuth()

    const fetchTasksByGroup = async (groupId: string) => {
        if (!user?.organisationId || !user?.jwt) {
            throw new Error("Authentication required. Please log in again.")
        }

        try {
            const response = await axios.get<TaskResponse[]>(
                `http://localhost:8080/api/v1/task/group/${groupId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${user.jwt}`,
                        "Content-Type": "application/json"
                    }
                }
            )

            // Map the API enum values to the expected format in the UI
            return response.data.map(task => ({
                ...task,
                // Map ProgressTypeEnum values to the expected status format
                status: mapProgressTypeToStatus(task.status)
            }))
        } catch (error) {
            console.error(`Error fetching tasks for group ${groupId}:`, error)
            throw error
        }
    }

    const setTaskStatus = async (taskId: string, status: string) => {
        if (!user?.jwt) {
            throw new Error("Authentication required. Please log in again.")
        }

        try {
            // Convert UI status back to backend ProgressTypeEnum
            const progressType = mapStatusToProgressType(status)

            const response = await axios.post(
                `http://localhost:8080/api/v1/task/set-status`,
                {
                    taskId: taskId,
                    status: progressType
                },
                {
                    headers: {
                        "Authorization": `Bearer ${user.jwt}`,
                        "Content-Type": "application/json"
                    }
                }
            )

            return response.data
        } catch (error) {
            console.error(`Error updating task status for ${taskId}:`, error)
            throw error
        }
    }

    // Maps the backend ProgressTypeEnum values to the frontend status values
    const mapProgressTypeToStatus = (progressType: string) => {
        switch (progressType) {
            case 'TODO':
                return 'NOT_STARTED'
            case 'IN_PROGRESS':
                return 'IN_PROGRESS'
            case 'DONE':
                return 'COMPLETED'
            case 'CANCELLED':
                return 'CANCELLED'
            default:
                return 'NOT_STARTED'
        }
    }

    // Maps the frontend status values back to backend ProgressTypeEnum
    const mapStatusToProgressType = (status: string) => {
        switch (status) {
            case 'NOT_STARTED':
                return 'TODO'
            case 'IN_PROGRESS':
                return 'IN_PROGRESS'
            case 'COMPLETED':
                return 'DONE'
            case 'CANCELLED':
                return 'CANCELLED'
            default:
                return 'TODO'
        }
    }

    return {
        fetchTasksByGroup,
        setTaskStatus,
        mapProgressTypeToStatus,
        mapStatusToProgressType
    }
}