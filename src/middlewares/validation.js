import { z } from 'zod';

export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const data = { ...req.body, ...req.params, ...req.query };
      const validated = await schema.parseAsync(data);
      
      // Replace request data with validated data
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }
      next(error);
    }
  };
};
