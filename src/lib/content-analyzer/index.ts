export interface ContentAnalysisResult {
  isWeak: boolean;
  score: number; // 0-100
  issues: string[];
}

export function analyzeContent(content: string, type: 'faq' | 'document' | 'policy'): ContentAnalysisResult {
  const issues: string[] = [];
  let score = 100;
  
  if (!content || content.trim().length === 0) {
    return { isWeak: true, score: 0, issues: ["Content is empty."] };
  }

  const wordCount = content.split(/\s+/).length;
  
  // Length checks
  if (type === 'faq' && wordCount < 10) {
    issues.push("Answer is too short to be helpful to the AI.");
    score -= 30;
  }
  
  if ((type === 'document' || type === 'policy') && wordCount < 50) {
    issues.push("Document is unusually short and may lack detail.");
    score -= 40;
  }

  // Formatting checks (markdown)
  if (type === 'document' && !content.includes('#')) {
    issues.push("Missing headings. Structure your document with Markdown (#) for better AI comprehension.");
    score -= 20;
  }

  // Completeness checks
  if (content.toLowerCase().includes('tbd') || content.toLowerCase().includes('placeholder')) {
    issues.push("Contains placeholder text like 'TBD'.");
    score -= 50;
  }

  return {
    isWeak: score < 70,
    score: Math.max(0, score),
    issues
  };
}
