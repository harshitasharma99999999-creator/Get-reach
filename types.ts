export interface Persona {
  title: string;
  description: string;
  jobRoles: string[];
  userType: 'Founder' | 'Consumer' | 'Business Owner' | 'Developer';
  technicalLevel: 'Non-Technical' | 'Semi-Technical' | 'Technical';
  industry: string;
  painPoints: string[];
}

export interface Community {
  name: string;
  url?: string;
  whyHere?: string;
}

export interface Platform {
  name: string;
  communities: string[] | Community[];
  importance: string;
  bestPostTypes?: string[];
  frequency?: string;
  visibility?: 'Low' | 'Medium' | 'High';
  engagement?: 'Low' | 'Medium' | 'High';
  conversionIntent: 'Low' | 'Medium' | 'High';
}

export interface Strategy {
  type: 'Organic' | 'Paid';
  platforms: string[];
  tone: string;
  guidelines: string[];
  commonMistakes: string[];
  isWorthIt: boolean;
}

export interface AdvancedInsights {
  competitorPresence: string;
  gaps: string[];
  keywordClusters: string[];
  whatToSayExamples: {
    platform: string;
    example: string;
    whyItWorks: string;
  }[];
}

export interface ReachReport {
  persona: Persona;
  platforms: Platform[];
  strategies?: {
    organic: Strategy;
    paid: Strategy;
  };
  advanced: AdvancedInsights;
}

export interface AnalysisInput {
  url: string;
  description?: string;
  region?: string;
  language?: string;
}
