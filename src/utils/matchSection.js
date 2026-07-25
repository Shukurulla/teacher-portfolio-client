import { generateSlug } from "./generateSlug";

// Ish joyi nomi "I. Sport ta'lim..." ko'rinishida (rim raqamli),
// yutuq bo'limi esa "Sport ta'lim..." (raqamsiz) bo'lishi mumkin.
// Solishtirishdan oldin bosh rim raqamni olib tashlaymiz.
export const normalizeSectionName = (text) =>
  generateSlug(String(text || "").replace(/^\s*[IVX]+\s*\.?\s*/i, ""));

// Berilgan slug/nom bo'yicha bo'limni topadi (avval aniq, keyin normalizatsiya bilan).
export const findSection = (sections, slugOrName) => {
  if (!Array.isArray(sections) || !slugOrName) return null;
  const exact = sections.find(
    (s) => generateSlug(s.section) === generateSlug(slugOrName)
  );
  if (exact) return exact;
  const target = normalizeSectionName(slugOrName);
  return (
    sections.find((s) => normalizeSectionName(s.section) === target) || null
  );
};
