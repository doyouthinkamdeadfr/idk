interface VectorizeVector {
	id: string;
	values: number[];
	metadata?: Record<string, string>;
}

interface VectorizeMatches {
	matches: {
		id: string;
		score: number;
		metadata?: Record<string, string>;
	}[];
}

interface VectorizeIndex {
	upsert(vectors: VectorizeVector[]): Promise<{ mutationId: string }>;
	query(vector: number[], options?: { topK?: number; returnMetadata?: boolean; filter?: Record<string, string> }): Promise<VectorizeMatches>;
	deleteByIds(ids: string[]): Promise<{ mutationId: string }>;
}

interface D1Database {
	prepare(sql: string): D1PreparedStatement;
}

interface D1PreparedStatement {
	bind(...args: any[]): D1PreparedStatement;
	all(): Promise<{ results: any[]; success: boolean }>;
	first(): Promise<any>;
	run(): Promise<{ success: boolean; meta: any }>;
}
