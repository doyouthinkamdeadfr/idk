<script lang="ts">
	import { onMount } from 'svelte';

	const lines = [
		'Ready when you are.',
		'Ask me anything about your data.',
		'What would you like to know?',
		'Your knowledge base is waiting.',
		'What are you curious about?'
	];

	let line = $state('');

	onMount(() => {
		line = lines[Math.floor(Math.random() * lines.length)];
	});
</script>

<div class="text-center">
	<h2 class="text-2xl font-bold text-text-primary">{line}</h2>
</div>
