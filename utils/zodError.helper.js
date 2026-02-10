export const formatZodError = (zodError) => {
  const formattedZodErrors = {};

  for (const issue of zodError.issues) {
    const field = issue.path.join(".") || "root";

    if (!formattedZodErrors[field]) {
      formattedZodErrors[field] = [];
    }

    formattedZodErrors[field].push(issue.message);
  }

  return formattedZodErrors;
};
