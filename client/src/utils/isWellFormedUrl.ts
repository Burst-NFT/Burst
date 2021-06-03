export const isWellFormedUrl = (url: string): boolean => {
  try {
    return !!new URL(url);
  } catch (_) {
    return false;
  }
};
