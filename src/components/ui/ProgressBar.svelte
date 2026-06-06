<script lang="ts">
	import { scrollProgress } from '$lib/scroll';

	let progress = $state(0);

	scrollProgress.subscribe((v) => {
		progress = v;
	});
</script>

<div class="fixed top-0 right-0 left-0 z-50 h-0.5">
	<div
		class="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-150"
		style="width: {progress * 100}%"
	></div>
</div>
