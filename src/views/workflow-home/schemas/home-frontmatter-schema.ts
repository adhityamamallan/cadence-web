import { z } from 'zod';

// An invalid field is dropped on its own, so it does not hide the other fields
const optionalText = z.string().trim().min(1).optional().catch(undefined);

const homeFrontmatterSchema = z
  .object({
    title: optionalText,
    badge: optionalText,
  })
  .passthrough();

export default homeFrontmatterSchema;
