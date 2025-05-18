export function getDifference<T extends string>(
  arr1: T[],
  arr2: T[],
  getFileNameFromUrl: (url: T) => string,
): { onlyInArr1: string[]; onlyInArr2: string[]; inBoth: string[] } {
  const fileNames1 = arr1.map(getFileNameFromUrl);
  const fileNames2 = arr2.map(getFileNameFromUrl);

  const onlyInArr1 = fileNames1.filter((name) => !fileNames2.includes(name));
  const onlyInArr2 = fileNames2.filter((name) => !fileNames1.includes(name));
  const inBoth = fileNames1.filter(
    (name) => fileNames2.includes(name) && fileNames1.includes(name),
  );

  return { onlyInArr1, onlyInArr2, inBoth };
}
