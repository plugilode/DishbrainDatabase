import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { name, company, email } = await request.json();
    
    if (email) {
      // Try Gravatar if email is available
      const hash = crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
      const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=404&s=400`;
      
      try {
        await axios.head(gravatarUrl);
        return NextResponse.json({ imageUrl: gravatarUrl });
      } catch (error) {
        console.log('No Gravatar found');
      }
    }

    // Fallback to company logo if no profile photo found
    if (company) {
      const domain = company?.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + '.com';
      const clearbitUrl = `https://logo.clearbit.com/${domain}`;
      
      try {
        await axios.head(clearbitUrl);
        return NextResponse.json({ imageUrl: clearbitUrl });
      } catch (error) {
        console.log('No company logo found');
      }
    }

    // Return default avatar if no image found
    return NextResponse.json({ 
      imageUrl: '/default-avatar.png',
      error: 'No suitable image found' 
    });

  } catch (error) {
    console.error('Error finding profile photo:', error);
    return NextResponse.json({ 
      imageUrl: '/default-avatar.png',
      error: 'Failed to fetch profile photo' 
    });
  }
} 