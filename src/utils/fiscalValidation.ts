export const validateSiret = (siret: string): boolean => {
  const cleaned = siret.replace(/\s/g, '');
  return /^\d{14}$/.test(cleaned);
};

export const formatSiret = (siret: string): string => {
  const cleaned = siret.replace(/\s/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
};

export const validateNDA = (nda: string): boolean => {
  // Format NDA : 11 chiffres
  const cleaned = nda.replace(/\s/g, '');
  return /^\d{11}$/.test(cleaned);
};
