import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const apiKey = process.env.CALORIE_NINJA_API_KEY;

    if (!apiKey) {
        console.error("CALORIE_NINJA_API_KEY is not set in environment variables.");
        return NextResponse.json({ error: 'API key is not configured on the server' }, { status: 500 });
    }

    try {
        const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`, {
            headers: {
                'X-Api-Key': apiKey,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("CalorieNinjas API Error:", response.status, errorText);
            return NextResponse.json(
                { error: 'Failed to fetch nutrition data from CalorieNinjas' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Error fetching from CalorieNinjas:", error);
        return NextResponse.json({ error: 'Internal server error while fetching nutrition data' }, { status: 500 });
    }
}
