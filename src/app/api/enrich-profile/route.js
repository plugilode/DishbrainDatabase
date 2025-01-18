import { enrichProfile } from '../../../scripts/enrich-expert-profile';

export async function POST(request) {
  try {
    const { linkedInUrl } = await request.json();
    
    console.log('Enrichment requested for LinkedIn URL:', linkedInUrl);
    
    // Get enriched data from LinkedIn
    const enrichedData = await enrichProfile(linkedInUrl);
    console.log('Enriched data:', enrichedData);
    
    if (!enrichedData) {
      console.error('No data returned from enrichment');
      return Response.json({ error: 'Failed to enrich profile' }, { status: 400 });
    }

    return Response.json(enrichedData);
  } catch (error) {
    console.error('Error in enrich-profile API:', error);
    return Response.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
} 