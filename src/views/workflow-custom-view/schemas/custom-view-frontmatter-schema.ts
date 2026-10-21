import { z } from 'zod';

const customViewFrontmatterSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
  })
  .passthrough();

export default customViewFrontmatterSchema;
