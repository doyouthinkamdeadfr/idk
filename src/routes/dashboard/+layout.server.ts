import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.session) {
		return redirect(302, '/login?redirect=/dashboard');
	}
	return { session: locals.session };
};
