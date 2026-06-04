<script lang="ts">
	interface Attachment {
		type: 'file' | 'image' | 'link';
		name: string;
		file?: File;
		url?: string;
	}

	interface SendPayload {
		text: string;
		attachments: Attachment[];
	}

	interface Props {
		onSend: (payload: SendPayload) => void;
		disabled?: boolean;
	}

	let { onSend, disabled = false }: Props = $props();

	let text = $state('');
	let addMenuOpen = $state(false);
	let attachments = $state<Attachment[]>([]);
	let linkInput = $state('');
	let showLinkInput = $state(false);
	let fileInput: HTMLInputElement | undefined = $state();
	let imageInput: HTMLInputElement | undefined = $state();

	let hasAttachments = $derived(attachments.length > 0);

	function handleSend() {
		const t = text.trim();
		if (!t && attachments.length === 0) return;
		if (disabled) return;
		onSend({ text: t, attachments });
		text = '';
		attachments = [];
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	}

	function toggleAddMenu(e: MouseEvent) {
		e.stopPropagation();
		addMenuOpen = !addMenuOpen;
		showLinkInput = false;
	}

	function closeAddMenu() {
		addMenuOpen = false;
		showLinkInput = false;
	}

	function autoResize(e: Event) {
		const el = e.target as HTMLTextAreaElement;
		el.style.height = 'auto';
		el.style.height = Math.min(el.scrollHeight, 160) + 'px';
	}

	function pickFiles() {
		fileInput?.click();
	}

	function pickImages() {
		imageInput?.click();
	}

	function onFilesPicked(e: Event) {
		const input = e.target as HTMLInputElement;
		if (!input.files) return;
		for (const f of input.files) {
			attachments = [...attachments, { type: 'file', name: f.name, file: f }];
		}
		input.value = '';
	}

	function onImagesPicked(e: Event) {
		const input = e.target as HTMLInputElement;
		if (!input.files) return;
		for (const f of input.files) {
			attachments = [...attachments, { type: 'image', name: f.name, file: f }];
		}
		input.value = '';
	}

	function addLink() {
		const url = linkInput.trim();
		if (!url) return;
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			attachments = [...attachments, { type: 'link', name: url, url: `https://${url}` }];
		} else {
			attachments = [...attachments, { type: 'link', name: url, url }];
		}
		linkInput = '';
		showLinkInput = false;
		addMenuOpen = false;
	}

	function removeAttachment(i: number) {
		attachments = attachments.filter((_, idx) => idx !== i);
	}

	// Voice input
	let isRecording = $state(false);
	let recognition: any = null;

	function toggleMic() {
		if (isRecording) {
			recognition?.stop();
			isRecording = false;
			return;
		}

		if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
			alert('Voice input is not supported in this browser.');
			return;
		}

		const SpeechRecognitionAPI = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
		recognition = new SpeechRecognitionAPI();
		recognition.interimResults = true;
		recognition.lang = 'en-US';

		recognition.onresult = (e: any) => {
			const transcript = Array.from(e.results as any[])
				.map((r: any) => r[0].transcript)
				.join('');
			text = transcript;
		};

		recognition.onend = () => {
			isRecording = false;
		};

		recognition.onerror = () => {
			isRecording = false;
		};

		recognition.start();
		isRecording = true;
	}
</script>

<svelte:window onclick={closeAddMenu} />

<input type="file" accept=".txt,.md" multiple bind:this={fileInput} onchange={onFilesPicked} class="hidden" />
<input type="file" accept="image/*" multiple bind:this={imageInput} onchange={onImagesPicked} class="hidden" />

<div class="px-6 py-4">
	<div class="mx-auto flex max-w-3xl flex-col gap-2">
		{#if hasAttachments}
			<div class="flex flex-wrap gap-2">
				{#each attachments as att, i}
					<div class="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-white px-2.5 py-1.5 text-xs text-text-primary">
						{#if att.type === 'image'}
							<span class="text-xs">🖼️</span>
						{:else if att.type === 'file'}
							<span class="text-xs">📄</span>
						{:else}
							<span class="text-xs">🔗</span>
						{/if}
						<span class="max-w-[200px] truncate">{att.name}</span>
						<button onclick={() => removeAttachment(i)} class="ml-1 text-text-muted hover:text-red-500 transition-colors">&times;</button>
					</div>
				{/each}
			</div>
		{/if}

		<div class="flex items-end gap-2 rounded-2xl border border-border-subtle bg-white px-3 py-2">
			<div class="relative">
				<button
					onclick={toggleAddMenu}
					disabled={disabled}
					class="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white transition-all disabled:opacity-40"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
				</button>
				{#if addMenuOpen}
					<div class="absolute top-full left-0 z-50 mt-2 w-48 rounded-xl border border-border-subtle bg-white py-1 shadow-lg" onclick={(e) => e.stopPropagation()}>
						<button onclick={() => { closeAddMenu(); pickImages(); }} class="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
							<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
							Photos
						</button>
						<button onclick={() => { closeAddMenu(); pickFiles(); }} class="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
							<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
							Files
						</button>
						<button onclick={() => { showLinkInput = !showLinkInput; }} class="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
							<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
							Link
						</button>
						{#if showLinkInput}
							<div class="border-t border-border-subtle px-3 py-2" onclick={(e) => e.stopPropagation()}>
								<div class="flex gap-1">
									<input
										bind:value={linkInput}
										onkeydown={(e) => { if (e.key === 'Enter') addLink(); }}
										type="text"
										placeholder="Paste URL..."
										class="flex-1 rounded-lg border border-border-subtle bg-bg-primary px-2 py-1 text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
									/>
									<button onclick={addLink} class="rounded-lg bg-accent-primary px-2 text-xs text-white hover:bg-accent-primary/90">Add</button>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<textarea
				bind:value={text}
				onkeydown={handleKeydown}
				oninput={autoResize}
				rows="1"
				placeholder="Type a message..."
				class="max-h-40 flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none leading-relaxed py-1"
				disabled={disabled}
			></textarea>

			<div class="flex items-center gap-1">
				<button
					onclick={toggleMic}
					disabled={disabled}
					class="flex h-8 w-8 items-center justify-center rounded-lg transition-all {isRecording ? 'text-red-500 bg-red-50' : 'text-text-muted hover:text-text-primary hover:bg-white'} disabled:opacity-40"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
					</svg>
				</button>
				<button
					onclick={handleSend}
					disabled={disabled || (!text.trim() && attachments.length === 0)}
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary text-white hover:bg-accent-primary/90 transition-all active:scale-95 disabled:opacity-40"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</div>
