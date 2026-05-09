'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '@/api/v1/tasksApi'
import { TASK_KEYS } from '@/api/v1/queryKeys'
import type { TaskFilters, TaskStatus } from '@/types/tasksDashboardTypes'
import type { CreateTaskInput, UpdateTaskInput, AddCommentInput } from '@/validators/taskValidator'

export function useTasks(filters: TaskFilters) {
  return useQuery({
    queryKey: TASK_KEYS.list(filters),
    queryFn: () => tasksApi.getAll(filters),
  })
}

export function useMyTasks(userId: string, filters: TaskFilters) {
  return useQuery({
    queryKey: TASK_KEYS.my(filters),
    queryFn: () => tasksApi.getMy(userId, filters),
  })
}

export function useTask(id: string | null) {
  return useQuery({
    queryKey: TASK_KEYS.detail(id ?? ''),
    queryFn: () => tasksApi.getById(id!),
    enabled: !!id,
  })
}

export function useTaskComments(taskId: string | null) {
  return useQuery({
    queryKey: TASK_KEYS.comments(taskId ?? ''),
    queryFn: () => tasksApi.getComments(taskId!),
    enabled: !!taskId,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaskInput) => tasksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      tasksApi.update(id, data),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
      queryClient.setQueryData(TASK_KEYS.detail(task.id), task)
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
    },
  })
}

export function useToggleTaskComplete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tasksApi.toggle(id),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
      queryClient.setQueryData(TASK_KEYS.detail(task.id), task)
    },
  })
}

export function useMoveTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      tasksApi.move(id, status),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
      queryClient.setQueryData(TASK_KEYS.detail(task.id), task)
    },
  })
}

export function useAddComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: AddCommentInput }) =>
      tasksApi.addComment(taskId, data),
    onSuccess: (_comment, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.comments(taskId) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.detail(taskId) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, commentId }: { taskId: string; commentId: string }) =>
      tasksApi.deleteComment(taskId, commentId),
    onSuccess: (_result, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.comments(taskId) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.detail(taskId) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
    },
  })
}
