export const generateUniqueOrganizationId = () => {
    return Math.random().toString(36).slice(2, 11);
  };