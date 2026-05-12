declare module 'sql.js' {
	export type Database = {
		exec: (sql: string) => unknown;
		export: () => Uint8Array;
	};
	export interface DatabaseConstructor {
		new (data?: Uint8Array): Database;
	}

	const initSqlJs: (config?: { locateFile?: (file: string) => string }) => Promise<{ Database: DatabaseConstructor }>;
	export default initSqlJs;
}
