export const toPostgresDateTime = (dateString: string | null) => {
  if (!dateString) return null;
  return new Date(dateString).toISOString();
};
