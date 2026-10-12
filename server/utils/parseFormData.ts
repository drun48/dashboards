export const ParseFormData = (formData: FormData) => {
  const result = {} as Record<string, unknown>;
  formData.forEach((value, key) => {
    if (value instanceof File) {
      result[key] = {
        name: value.name,
        size: value.size,
        type: value.type,
      };
    } else {
      result[key] = value;
    }
  });
  return result;
};
