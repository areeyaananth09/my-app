import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables
config();


async function runMigration() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(process.env.DATABASE_URL);

    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'db', 'migrations', '001_create_otp_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('Running OTP table migration...');

    try {
        // Execute the CREATE TABLE statement
        await sql`
            CREATE TABLE IF NOT EXISTS otp (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL,
                code TEXT NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                verified BOOLEAN NOT NULL DEFAULT false,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create indexes
        await sql`CREATE INDEX IF NOT EXISTS idx_otp_email ON otp(email)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_otp_expires_at ON otp(expires_at)`;

        console.log('✅ Migration completed successfully!');
        console.log('OTP table created with indexes.');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
