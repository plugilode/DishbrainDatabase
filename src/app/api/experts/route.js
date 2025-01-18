import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    // For now, return mock data
    return NextResponse.json([
      {
        id: "exp391",
        personalInfo: {
          fullName: "Dr. Aidan Gomez",
          image: "/default-avatar.png",
          title: "Dr."
        },
        institution: {
          name: "AI Research Institute"
        },
        currentRole: {
          title: "Lead AI Researcher"
        },
        expertise: {
          primary: ["Machine Learning", "Deep Learning"]
        },
        academicMetrics: {
          publications: {
            total: 45
          }
        }
      },
      // ... other experts
    ]);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 