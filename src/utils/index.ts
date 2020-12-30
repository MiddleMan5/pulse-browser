export const isRenderer = () => process && (process as any)?.type === "renderer";
