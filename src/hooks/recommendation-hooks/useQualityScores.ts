import { useMemo } from 'react';
import { BusinessState } from '@/lib/health-engine/types';
import { calculateKnowledgeQuality } from '@/lib/quality-engine/knowledge-quality';
import { calculateCrmQuality } from '@/lib/quality-engine/crm-quality';

export function useQualityScores(state: BusinessState) {
  const knowledgeScore = useMemo(() => {
    return calculateKnowledgeQuality(state);
  }, [state]);

  const crmScore = useMemo(() => {
    return calculateCrmQuality(state);
  }, [state]);

  return {
    knowledgeScore,
    crmScore
  };
}
