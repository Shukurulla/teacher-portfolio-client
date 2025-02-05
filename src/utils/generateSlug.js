export function generateSlug(text) {
  // Maxsus o‘zbek harflarini oddiy ingliz harflariga o‘tkazish
  const replacements = {
    à: "a",
    á: "a",
    â: "a",
    ä: "a",
    å: "a",
    ā: "a",
    ç: "c",
    è: "e",
    é: "e",
    ê: "e",
    ë: "e",
    ğ: "g",
    ī: "i",
    ì: "i",
    í: "i",
    î: "i",
    ï: "i",
    ñ: "n",
    ò: "o",
    ó: "o",
    ô: "o",
    ö: "o",
    ő: "o",
    ù: "u",
    ú: "u",
    û: "u",
    ü: "u",
    ű: "u",
    ÿ: "y",
    ā: "a",
    ş: "s",
    ž: "z",
    ə: "e",
    ö: "o",
    ü: "u",
    ğ: "g",
    ı: "i",
    ç: "c",
    ş: "s",
    ў: "o",
    қ: "q",
    ғ: "g",
    ҳ: "h",
  };

  // Harflarni almashtirish
  let slug = text
    .toLowerCase()
    .replace(
      /[àáâäåāçèéêëğīìíîïñòóôöőùúûüűÿāşžəöüğıçşўқғҳ]/g,
      (char) => replacements[char] || char
    );

  // Maxsus belgilarni olib tashlash va bo‘shliqlarni `-` bilan almashtirish
  slug = slug
    .replace(/[^a-z0-9\s-]/g, "") // Faqat harf-raqam va bo‘shliqlarni qoldirish
    .replace(/\s+/g, "-") // Bo‘shliqlarni `-` bilan almashtirish
    .replace(/-+/g, "-") // Ortig‘i bilan ketma-ket kelgan `-`larni bitta `-`ga qisqartirish
    .replace(/^-+|-+$/g, ""); // Boshi yoki oxiridagi `-` belgilarini olib tashlash

  return slug;
}
