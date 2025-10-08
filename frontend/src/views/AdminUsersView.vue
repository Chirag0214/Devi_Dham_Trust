<template>
	<div class="min-h-screen flex bg-gray-50">
		<Sidebar :user="user" :is-admin="isAdmin" />

		<main class="flex-1 p-8">
			<h1 class="text-2xl font-bold mb-6">Users</h1>

			<section class="bg-white p-6 rounded-lg shadow">
				<h2 class="text-xl font-semibold mb-4">Registered Users</h2>

				<table class="w-full text-left border-collapse">
					<thead>
						<tr class="text-sm text-gray-600">
							<th class="pb-2">#</th>
							<th class="pb-2">Name</th>
							<th class="pb-2">Email</th>
							<th class="pb-2">Role</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(u, idx) in users" :key="u.email" class="border-t">
							<td class="py-2">{{ idx + 1 }}</td>
							<td class="py-2">{{ u.name || '-' }}</td>
							<td class="py-2">{{ u.email }}</td>
							<td class="py-2">{{ u.role || 'user' }}</td>
						</tr>
						<tr v-if="users.length === 0">
							<td colspan="4" class="py-4 text-center text-gray-500">No users found</td>
						</tr>
					</tbody>
				</table>
			</section>
		</main>
	</div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import auth from '@/stores/auth';
import { ref, computed, onMounted } from 'vue';

const user = auth;
const isAdmin = computed(() => {
	return !!(user.value && (user.value.role === 'admin' || user.value.email === 'admin@devidhaam.org'));
});

const users = ref<Array<any>>([]);

onMounted(() => {
	try {
		users.value = JSON.parse(localStorage.getItem('users') || '[]');
	} catch (e) {
		users.value = [];
	}
});
</script>