interface D1Database {
	prepare(sql: string): D1PreparedStatement;
}

interface D1PreparedStatement {
	bind(...args: any[]): D1PreparedStatement;
	all(): Promise<{ results: any[]; success: boolean }>;
	first(): Promise<any>;
	run(): Promise<{ success: boolean; meta: any }>;
}
