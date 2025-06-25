export function createLoggerMeta(domain?: string, context?: string) {
  return {
    domain: domain || '-',
    context: context || '-',
  };
}
