export interface MockChat {
	id: string;
	title: string;
	pinned: boolean;
	archived: boolean;
	updatedAt: Date;
}

export interface MockDocument {
	id: string;
	name: string;
	type: 'pdf' | 'doc' | 'txt' | 'link';
	date: Date;
	_size?: string;
}

export interface MockProject {
	id: string;
	name: string;
	description: string;
	docCount: number;
}

export const mockChats: MockChat[] = [
	{
		id: 'c1',
		title: 'Q2 Revenue Analysis',
		pinned: true,
		archived: false,
		updatedAt: new Date('2026-06-02')
	},
	{
		id: 'c2',
		title: 'Customer Support Bot',
		pinned: true,
		archived: false,
		updatedAt: new Date('2026-06-01')
	},
	{
		id: 'c3',
		title: 'Product Requirements Doc',
		pinned: false,
		archived: false,
		updatedAt: new Date('2026-05-30')
	},
	{
		id: 'c4',
		title: 'Engineering Sprint Review',
		pinned: false,
		archived: false,
		updatedAt: new Date('2026-05-29')
	},
	{
		id: 'c5',
		title: 'Marketing Strategy 2026',
		pinned: false,
		archived: false,
		updatedAt: new Date('2026-05-28')
	},
	{
		id: 'c6',
		title: 'Competitor Analysis',
		pinned: false,
		archived: false,
		updatedAt: new Date('2026-05-27')
	},
	{
		id: 'c7',
		title: 'User Research Findings',
		pinned: false,
		archived: false,
		updatedAt: new Date('2026-05-26')
	},
	{
		id: 'c8',
		title: 'API Documentation Draft',
		pinned: false,
		archived: false,
		updatedAt: new Date('2026-05-25')
	}
];

export const mockDocuments: MockDocument[] = [
	{
		id: 'd1',
		name: 'Annual Report 2025.pdf',
		type: 'pdf',
		date: new Date('2026-05-20'),
		_size: '12 MB'
	},
	{
		id: 'd2',
		name: 'Engineering Wiki.docx',
		type: 'doc',
		date: new Date('2026-05-18'),
		_size: '4 MB'
	},
	{
		id: 'd3',
		name: 'Meeting Notes.txt',
		type: 'txt',
		date: new Date('2026-05-15'),
		_size: '28 KB'
	},
	{ id: 'd4', name: 'Notion — Product Roadmap', type: 'link', date: new Date('2026-05-10') },
	{ id: 'd5', name: 'Google Docs — Q3 Planning', type: 'link', date: new Date('2026-05-08') }
];

export const mockProjects: MockProject[] = [
	{
		id: 'p1',
		name: 'Website Redesign',
		description: 'Marketing site overhaul with new brand guidelines',
		docCount: 12
	},
	{
		id: 'p2',
		name: 'Mobile App v2',
		description: 'React Native rewrite with offline support',
		docCount: 8
	},
	{
		id: 'p3',
		name: 'Internal Tools',
		description: 'Dashboard and admin panel improvements',
		docCount: 5
	}
];
