import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Here you would normally interact with your database
    // For now, return mock data
    return NextResponse.json({
      success: true,
      companies: [
        {
          name: "DeepMind Deutschland GmbH",
          location: "Berlin",
          focus: "Künstliche Intelligenz & Deep Learning",
          employees: 250,
          founded: 2018,
          projects: "AlphaFold, Robotik-Steuerung",
          logo_url: "/company1.jpg"
        },
        // ... other companies
      ]
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 