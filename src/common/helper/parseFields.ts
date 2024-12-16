export const parseFields = (data: any): Record<string, any> => {
  if (typeof data !== 'object' || data === null) {
    throw new TypeError('Expected an object for parsing fields.');
  }

  const parsedData: Record<string, any> = {};

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      try {
        parsedData[key] = JSON.parse(data[key]);
      } catch (error) {
        parsedData[key] = data[key]; // Якщо поле не JSON, залишаємо як є
      }
    }
  }

  return parsedData;
};
