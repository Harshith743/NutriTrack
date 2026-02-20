import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Define the absolute path to ensure we write to the project root.
const dataFilePath = path.join(process.cwd(), 'nutrihistory.json');

// Ensure the file exists, if not create an empty array.
async function initFile() {
    try {
        await fs.access(dataFilePath);
    } catch {
        await fs.writeFile(dataFilePath, JSON.stringify([]), 'utf8');
    }
}

export async function GET() {
    await initFile();
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        console.error("Failed to read history:", error);
        return NextResponse.json({ error: 'Failed to read history data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await initFile();
    try {
        const newEntry = await request.json();
        const data = await fs.readFile(dataFilePath, 'utf8');
        const history = JSON.parse(data);

        // Add the new entry to the array
        history.push(newEntry);

        // Write back to file
        await fs.writeFile(dataFilePath, JSON.stringify(history, null, 2), 'utf8');

        return NextResponse.json({ success: true, entry: newEntry });
    } catch (error) {
        console.error("Failed to write history:", error);
        return NextResponse.json({ error: 'Failed to write history data' }, { status: 500 });
    }
}
