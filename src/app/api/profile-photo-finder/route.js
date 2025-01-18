import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { name, company } = await request.json();
    
    // Try to get company logo/profile from Clearbit
    const domain = company?.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + '.com';
    const clearbitUrl = `https://logo.clearbit.com/${domain}`;
    
    try {
      // Check if image exists
      await axios.head(clearbitUrl);
      return NextResponse.json({ imageUrl: clearbitUrl });
    } catch (error) {
      // If company logo not found, try LinkedIn profile URL
      const linkedinUrl = `https://www.linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`;
      try {
        const response = await axios.head(linkedinUrl);
        return NextResponse.json({ imageUrl: linkedinUrl + '/photo' });
      } catch (linkedinError) {
        // Return default avatar if both attempts fail
        return NextResponse.json({ 
          imageUrl: '/default-avatar.png',
          error: 'No suitable image found' 
        });
      }
    }
  } catch (error) {
    console.error('Error finding profile photo:', error);
    return NextResponse.json({ 
      imageUrl: '/default-avatar.png',
      error: 'Failed to fetch profile photo' 
    });
  }
} 