import { ZodSchema, ZodError } from 'zod';

/**
 * Fungsi validasi universal menggunakan Zod.
 * Akan throw jika data tidak valid.
 */
export function validateWith<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data); // throw otomatis kalau invalid
  } catch (error) {
    if (error instanceof ZodError) {
      throw error; // biar bisa ditangkap filter atau try/catch
    }
    throw new Error('Unknown validation error');
  }
}
