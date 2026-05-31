import { readFileSync, writeFileSync } from 'fs';

const filePath = 'node_modules/@better-auth/drizzle-adapter/dist/index.mjs';
let content = readFileSync(filePath, 'utf-8');

if (!content.includes('supportsDates: false')) {
	content = content.replace(
		'debugLogs: config.debugLogs ?? false,',
		'debugLogs: config.debugLogs ?? false,\n\t\t\tsupportsDates: false,'
	);
	writeFileSync(filePath, content);
	console.log('Patched @better-auth/drizzle-adapter with supportsDates: false');
} else {
	console.log('Patch already applied');
}
