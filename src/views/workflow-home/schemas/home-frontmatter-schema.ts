import { z } from 'zod';

const homeFrontmatterSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
  })
  .passthrough();

export default homeFrontmatterSchema;
