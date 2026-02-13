const ACTION_VERBS = [
  "built", "developed", "designed", "implemented", "led", "improved",
  "created", "optimized", "automated", "managed", "deployed", "integrated",
  "architected", "launched", "reduced", "increased", "established",
  "maintained", "configured", "migrated", "refactored", "scaled",
  "collaborated", "delivered", "engineered", "streamlined", "resolved",
];

const METRIC_PATTERN = /\d+%|\d+x|\d+k|\d+\+|\d+K|\$\d+|\d+ (users|requests|clients|customers|projects|months|years|teams|endpoints|pages)/i;

export interface BulletHint {
  needsVerb: boolean;
  needsMetric: boolean;
}

export function analyzeBullet(text: string): BulletHint {
  const trimmed = text.trim();
  if (!trimmed) return { needsVerb: false, needsMetric: false };

  const firstWord = trimmed.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, "");
  const needsVerb = !ACTION_VERBS.includes(firstWord);
  const needsMetric = !METRIC_PATTERN.test(trimmed);

  return { needsVerb, needsMetric };
}
