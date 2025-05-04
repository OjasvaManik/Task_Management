"use client"

import { useEffect, useState } from "react"
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

export const useTaskService = () => {
    const { user } = useAuth()

    const fetchTasksByGroup = async (groupId: string) => {
        if (!user?.organisationId || !user?.jwt) {
            throw new Error("Authentication required. Please log in again.")
        }

        try {
            const request = {
                groupId: groupId,
                organisationId: user.organisationId
            }

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

    return {
        fetchTasksByGroup
    }
}