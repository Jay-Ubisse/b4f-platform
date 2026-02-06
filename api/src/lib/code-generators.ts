export function generateCandidateCode(): string {
  const prefix = "MZ";
  const now = new Date();

  // Current day (2 digits)
  const day = now.getDate().toString().padStart(2, "0");

  // Current seconds and milliseconds (4 digits total)
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const milliseconds = now
    .getMilliseconds()
    .toString()
    .padStart(3, "0")
    .slice(0, 2); // take first 2 digits

  const suffix = seconds + milliseconds; // 4 digits total

  return prefix + day + suffix;
}
