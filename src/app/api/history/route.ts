import { NextResponse } from 'next/server';
import { db } from '@/utils/firebaseAdmin';

export async function GET() {
    try {
        const snapshot = await db.ref('meals').once('value');
        const data = snapshot.val();

        // Firebase returns an object of objects, we need an array for the frontend
        const historyArray = data ? Object.values(data) : [];

        return NextResponse.json(historyArray);
    } catch (error) {
        console.error("Failed to read history from Firebase:", error);
        return NextResponse.json({ error: 'Failed to read history data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newEntry = await request.json();

        // Use the entry ID as the Firebase key
        await db.ref(`meals/${newEntry.id}`).set(newEntry);

        return NextResponse.json({ success: true, entry: newEntry });
    } catch (error) {
        console.error("Failed to write history to Firebase:", error);
        return NextResponse.json({ error: 'Failed to write history data' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        // Remove the specific meal from Firebase
        await db.ref(`meals/${id}`).remove();

        return NextResponse.json({ success: true, deletedId: id });
    } catch (error) {
        console.error("Failed to delete history item from Firebase:", error);
        return NextResponse.json({ error: 'Failed to delete history data' }, { status: 500 });
    }
}
