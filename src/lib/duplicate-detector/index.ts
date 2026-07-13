export function calculateStringSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 100;
  
  // Basic Jaccard similarity for words
  const words1 = new Set(s1.split(/\W+/).filter(Boolean));
  const words2 = new Set(s2.split(/\W+/).filter(Boolean));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  if (union.size === 0) return 0;
  return Math.round((intersection.size / union.size) * 100);
}

export function detectDuplicates<T>(
  items: T[], 
  getText: (item: T) => string, 
  threshold: number = 85
): Array<{ item1: T, item2: T, similarity: number }> {
  const duplicates: Array<{ item1: T, item2: T, similarity: number }> = [];
  
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const text1 = getText(items[i]);
      const text2 = getText(items[j]);
      
      const similarity = calculateStringSimilarity(text1, text2);
      if (similarity >= threshold) {
        duplicates.push({ item1: items[i], item2: items[j], similarity });
      }
    }
  }
  
  return duplicates;
}
