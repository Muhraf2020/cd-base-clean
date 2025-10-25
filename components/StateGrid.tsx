'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StateInfo {
  code: string;
  name: string;
  clinicCount: number;
}

const US_STATES_FULL: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'Washington DC'
};

export default function StateGrid() {
  const [states, setStates] = useState<StateInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStateCounts();
  }, []);

  const loadStateCounts = async () => {
    try {
      setLoading(true);
      // Fetch counts for each state
      const stateCounts: StateInfo[] = [];
      
      for (const [code, name] of Object.entries(US_STATES_FULL)) {
        const response = await fetch(`/api/clinics?state=${code}&per_page=1`);
        const data = await response.json();
        
        if (data.total > 0) {
          stateCounts.push({
            code,
            name,
            clinicCount: data.total
          });
        }
      }

      // Sort by clinic count (descending)
      stateCounts.sort((a, b) => b.clinicCount - a.clinicCount);
      setStates(stateCounts);
    } catch (error) {
      console.error('Error loading state counts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {states.map((state) => (
        <Link
          key={state.code}
          href={`/clinics?state=${state.code}`}
          className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 group border-2 border-blue-200 hover:border-blue-400"
        >
          <div className="flex flex-col items-center text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
              {state.code}
            </div>
            <div className="text-sm font-medium text-gray-700 mb-2">
              {state.name}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="font-semibold">{state.clinicCount}</span>
              <span>clinics</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
