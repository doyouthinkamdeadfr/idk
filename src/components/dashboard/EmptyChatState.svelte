<script lang="ts">
	const lines = [
		'Ready when you are.',
		'Ask me anything about your data.',
		'What would you like to know?',
		'Your knowledge base is waiting.',
		'What are you curious about?',
	];

	let index = $state(Math.floor(Math.random() * lines.length));

	function refresh() {
		index = (index + 1) % lines.length;
	}
</script>

<div class="flex flex-1 items-center justify-center">
	<div class="text-center">
		<button onclick={refresh} class="group">
			<h2 class="text-2xl font-bold text-text-primary group-hover:text-accent-primary transition-colors">{lines[index]}</h2>
		</button>
		<p class="mt-2 text-sm text-text-muted">Click the message to cycle through prompts.</p>
	</div>
</div>
