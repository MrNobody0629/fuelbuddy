<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold">My Tasks</h2>
      <select v-model="filter" class="border rounded px-3 py-2 text-sm">
        <option value="all">All</option>
        <option value="mine">My Tasks</option>
        <option value="shared">Shared</option>
      </select>
    </div>

    <div v-if="tasks.filteredTasks.length === 0" class="text-gray-500 text-center mt-8">
      No tasks to show.
    </div>

    <div class="space-y-4">
      <div
        v-for="task in tasks.filteredTasks"
        :key="task.id"
        class="flex items-center justify-between bg-white shadow-md px-6 py-4 rounded-lg hover:shadow-lg transition-shadow"
      >
        <div class="flex-1">
          <h3 class="text-md font-medium truncate">{{ task.title }}</h3>
          <p class="text-sm text-gray-600 truncate">{{ task.description }}</p>
        </div>
        <button
          @click="openSharePopup(task.id)"
          class="ml-4 text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Share
        </button>
      </div>
    </div>

    <!-- Share Popup -->
    <div
      v-if="showPopup"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      @click.self="closePopup"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-80">
        <h4 class="text-lg font-semibold mb-3">Share Task</h4>
        <input
          v-model="shareEmail"
          type="email"
          placeholder="Enter email"
          class="w-full border px-3 py-2 rounded mb-3"
        />
        <div class="flex justify-end gap-2">
          <button @click="closePopup" class="px-3 py-2 text-gray-600">Cancel</button>
          <button
            @click="share"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useTaskStore } from '../stores/task.ts';
import { useToast } from 'vue-toastification';
const toast = useToast();

const tasks = useTaskStore();
const shareEmail = ref('');
const showPopup = ref(false);
const selectedTaskId = ref('');
const filter = ref('all');

const openSharePopup = (taskId: string) => {
  selectedTaskId.value = taskId;
  showPopup.value = true;
};

const closePopup = () => {
  shareEmail.value = '';
  showPopup.value = false;
};

const share = async () => {
  await tasks.shareTask(selectedTaskId.value, shareEmail.value, closePopup);
};

onMounted(() => {
  tasks.fetchTasks(filter.value as "all" | "mine" | "shared");
});
watch(filter, (newVal) => {
  tasks.fetchTasks(newVal as "all" | "mine" | "shared");
});
</script>

<style scoped>
/* Container styling */
.max-w-4xl {
  max-width: 64rem;
  margin-left: auto;
  margin-right: auto;
  padding: 1.5rem;
}

/* Flex utilities */
.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}

/* Select input */
select {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 0.875rem;
}

/* Task card grid */
.grid {
  display: grid;
  gap: 1rem;
}
.task-card {
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 1.25rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: box-shadow 0.2s ease;
}
.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.task-card h3 {
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0;
}
.task-card p {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

/* Share button */
button {
  cursor: pointer;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
}
button:hover {
  background-color: #2563eb;
}

/* Empty state */
.text-gray-500 {
  color: #6b7280;
  text-align: center;
  margin-top: 2rem;
}

/* Popup overlay and modal */
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup > div {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  width: 320px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}
.popup h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.popup input {
  width: 100%;
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}
.popup .flex {
  justify-content: flex-end;
  gap: 0.5rem;
}
.popup .flex button {
  padding: 0.5rem 0.75rem;
}
.popup .flex button:first-child {
  background: none;
  color: #666;
}
</style>
