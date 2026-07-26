/**
 * Deep-merge incoming site content with the default base.
 */
export function mergeSiteContent(base, incoming) {
  if (!incoming || typeof incoming !== 'object') return base;

  return Object.keys(base).reduce((merged, key) => {
    const baseValue = base[key];
    const incomingValue = incoming[key];

    if (baseValue && typeof baseValue === 'object' && !Array.isArray(baseValue)) {
      merged[key] = {
        ...baseValue,
        ...(incomingValue && typeof incomingValue === 'object' && !Array.isArray(incomingValue) ? incomingValue : {}),
      };
      return merged;
    }

    merged[key] = incomingValue ?? baseValue;
    return merged;
  }, {});
}
