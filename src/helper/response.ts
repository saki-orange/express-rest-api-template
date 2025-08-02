export const createSuccessResponse = (message: string = "", data: JSONSerializable = null) => {
  return {
    success: true,
    data,
    message,
  };
};

export const createErrorResponse = (message: string = "", details: JSONSerializableObject[] = []) => {
  return {
    success: false,
    error: {
      details,
    },
    message,
  };
};
