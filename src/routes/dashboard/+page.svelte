<script lang="ts">
	import { page } from '$app/stores';
	import { authClient } from '$lib/auth-client';

	async function handleLogout() {
		await authClient.signOut();
		window.location.href = '/';
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-6">
	<div class="w-full max-w-md text-center">
		<h1 class="text-3xl font-bold tracking-tight text-text-primary">Welcome to Memory</h1>
		<p class="mt-3 text-base text-text-muted">
			Logged in as <span class="font-semibold text-accent-primary">{$page.data.session?.user?.email ?? 'unknown'}</span>
		</p>
		<div class="mt-8 rounded-2xl border border-border-subtle bg-white p-8 shadow-sm">
			<p class="text-sm text-text-muted">Your dashboard is coming soon.</p>
			<p class="mt-2 text-xs text-text-muted/60">Phase 3 will bring document upload, search, and insights.</p>
		</div>
		<button
			onclick={handleLogout}
			class="mt-6 inline-block rounded-full border border-border-subtle px-6 py-2.5 text-sm font-medium text-text-muted transition-all duration-200 hover:border-accent-primary hover:text-accent-primary active:scale-95"
		>
			Sign out
		</button>
	</div>
</div>
