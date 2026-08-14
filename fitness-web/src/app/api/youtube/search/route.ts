import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const exerciseName = searchParams.get('exerciseName');

    if (!exerciseName || typeof exerciseName !== 'string') {
        return NextResponse.json({ error: 'Exercise name required', videos: [] }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey || apiKey === 'your_youtube_api_key_here') {
        return NextResponse.json({
            success: false,
            error: 'YouTube API key not configured',
            videos: getFallbackVideos(exerciseName)
        });
    }

    try {
        // Search query optimization
        let query = `${exerciseName} exercise tutorial`;
        const lowerName = exerciseName.toLowerCase();
        if (lowerName.includes('yoga')) {
            query = `${exerciseName} tutorial`;
        } else if (lowerName.includes('zumba')) {
            query = `${exerciseName} class`;
        } else if (lowerName.includes('grind') || lowerName.includes('flexibility') || lowerName.includes('stretch')) {
            query = `${exerciseName} routine tutorial`;
        }

        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=3&key=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 403) {
                return NextResponse.json({
                    success: false,
                    error: 'YouTube API quota exceeded',
                    videos: getFallbackVideos(exerciseName)
                });
            }
            throw new Error(`YouTube API returned status ${response.status}`);
        }

        const data = await response.json();
        if (!data.items || data.items.length === 0) {
            return NextResponse.json({ success: true, videos: [] });
        }

        const videos = data.items.map((item: any) => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || '',
            youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        }));

        return NextResponse.json({ success: true, videos });
    } catch (error) {
        console.error('YouTube API error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch videos from API',
            videos: getFallbackVideos(exerciseName)
        });
    }
}

function getFallbackVideos(exerciseName: string) {
    return [
        {
            videoId: 'fallback',
            title: `${exerciseName} - Tutorial Search Result`,
            channel: 'YouTube Search Redirect',
            thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=360&q=80',
            youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(exerciseName + ' tutorial')}`,
        }
    ];
}
