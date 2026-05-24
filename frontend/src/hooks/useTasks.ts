'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import tasksAPI from '@/api/v1/tasksApi'
import { TASK_KEYS } from '@/api/v1/queryKeys'
import type { TaskFilters, TaskStatus } from '@/types/tasksDashboardTypes'
import type { CreateTaskInput, UpdateTaskInput, AddCommentInput } from '@/validators/taskValidator'

export function useTasks(filters: TaskFilters) {
  return useQuery({
    queryKey: TASK_KEYS.list(filters),
    queryFn: () => tasksAPI.getAll(filters),
  })
}

export function useMyTasks(userId: string, filters: TaskFilters) {
  return useQuery({
    queryKey: TASK_KEYS.my(filters),
    queryFn: () => tasksAPI.getMy(userId, filters),
  })
}

export function useTask(id: string | null) {
  return useQuery({
    queryKey: TASK_KEYS.detail(id ?? ''),
    queryFn: () => tasksAPI.getById(id!),
    enabled: !!id,
  })
}

export function useTaskComments(taskId: string | null) {
  return useQuery({
    queryKey: TASK_KEYS.comments(taskId ?? ''),
    queryFn: () => tasksAPI.getComments(taskId!),
    enabled: !!taskId,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTaskInput) => tasksAPI.create(data),
    onSuccess: () => {
      toast.success('Задача успешно создана')
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
    },
    onError: () => {
      toast.error('Ошибка при создании задачи')
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      tasksAPI.update(id, data),
    onSuccess: (task) => {
      toast.success('Задача обновлена')
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
      queryClient.setQueryData(TASK_KEYS.detail(task.id), task)
    },
    onError: () => {
      toast.error('Ошибка при обновлении задачи')
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tasksAPI.delete(id),
    onSuccess: () => {
      toast.success('Задача удалена')
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
    },
    onError: () => {
      toast.error('Ошибка при удалении задачи')
    },
  })
}

export function useToggleTaskComplete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tasksAPI.toggle(id),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
      queryClient.setQueryData(TASK_KEYS.detail(task.id), task)
    },
    onError: () => {
      toast.error('Ошибка')
    },
  })
}

export function useMoveTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      tasksAPI.move(id, status),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
      queryClient.setQueryData(TASK_KEYS.detail(task.id), task)
    },
    onError: () => {
      toast.error('Ошибка при перемещении задачи')
    },
  })
}

export function useAddComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: AddCommentInput }) =>
      tasksAPI.addComment(taskId, data),
    onSuccess: (_comment, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.comments(taskId) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.detail(taskId) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
    },
    onError: () => {
      toast.error('Ошибка при добавлении комментария')
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, commentId }: { taskId: string; commentId: string }) =>
      tasksAPI.deleteComment(taskId, commentId),
    onSuccess: (_result, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.comments(taskId) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.detail(taskId) })
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all })
    },
    onError: () => {
      toast.error('Ошибка при удалении комментария')
    },
  })
}
