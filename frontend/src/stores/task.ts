import { defineStore } from 'pinia';
import { get, post } from "../api/auth";
import { useToast } from 'vue-toastification';
const toast = useToast();

export type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  ownerId: string;
};

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    filter: 'all' as 'all' | 'mine' | 'shared',
  }),
  getters: {
    filteredTasks(state) {
      if (state.filter === 'all') return state.tasks;
      if (state.filter === 'mine') return state.tasks.filter(t => t.ownerId === localStorage.getItem('uid'));
      return state.tasks.filter(t => t.ownerId !== localStorage.getItem('uid'));
    },
  },
  actions: {
    },
  },
});
