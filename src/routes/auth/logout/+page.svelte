<script lang="ts">
	import { onMount } from 'svelte';
	import { authClient } from '$lib/auth-client';

	onMount(async () => {
		await authClient.signOut();
		window.location.href = '/';
	});
</script>
