<script lang="ts">
</script>

<div class="loader">
	<div class="spinner"></div>
	<span class="brand">Memory</span>
</div>

<style>
	.loader {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		background: var(--color-bg-primary, #f7f5f0);
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid #e5e2dc;
		border-top-color: #e8634a;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.brand {
		font-size: 18px;
		font-weight: 700;
		color: #2a2a2a;
		font-family: system-ui, sans-serif;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
