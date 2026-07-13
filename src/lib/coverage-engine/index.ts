import { QuestionCoverage, DomainCoverageReport } from "../ai-readiness-engine/types";

export function calculateDomainCoverage(
  domain: string,
  questions: QuestionCoverage[]
): DomainCoverageReport {
  if (questions.length === 0) {
    return {
      domain,
      coveragePercentage: 0,
      coveredQuestions: 0,
      totalQuestions: 0,
      questions: [],
      missingInformation: [],
    };
  }

  let coveredCount = 0;
  const missingInfoSet = new Set<string>();

  for (const q of questions) {
    if (q.canAnswer) {
      coveredCount++;
    }
    for (const missing of q.missingData) {
      missingInfoSet.add(missing);
    }
  }

  const coveragePercentage = Math.round((coveredCount / questions.length) * 100);

  return {
    domain,
    coveragePercentage,
    coveredQuestions: coveredCount,
    totalQuestions: questions.length,
    questions,
    missingInformation: Array.from(missingInfoSet),
  };
}
