import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(request) {
  try {
    const { name, company, linkedinUrl } = await request.json();
    
    // Create search query
    const searchQuery = encodeURIComponent(`${name} ${company} news`);
    const url = `https://www.google.com/search?q=${searchQuery}&tbm=nws`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const newsItems = [];

    // Extract news items
    $('div.g').slice(0, 5).each((i, element) => {
      const title = $(element).find('h3').text();
      const link = $(element).find('a').attr('href');
      const snippet = $(element).find('.VwiC3b').text();
      const date = $(element).find('.ZE0LJd').text();

      if (title && link) {
        newsItems.push({
          title,
          link: link.startsWith('/url?q=') ? link.split('/url?q=')[1].split('&')[0] : link,
          snippet,
          date
        });
      }
    });

    return NextResponse.json(newsItems);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
} 