import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, company } = await request.json();
    
    // Create search query from name and company
    const searchQuery = encodeURIComponent(`${name} ${company}`);
    const apiUrl = `https://newsapi.org/v2/everything?q=${searchQuery}&sortBy=publishedAt&language=de&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === 'ok' && data.articles) {
      const newsItems = data.articles.map(article => ({
        title: article.title,
        link: article.url,
        snippet: article.description,
        date: new Date(article.publishedAt).toLocaleDateString('de-DE'),
        source: article.source.name
      }));

      return NextResponse.json(newsItems);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
} 