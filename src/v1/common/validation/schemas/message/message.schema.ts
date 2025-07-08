import z from 'zod';

export const messageIdSchema = z.number().int().positive();
export const ownerIdSchema = z.number().int().positive();
export const contentSchema = z.string().min(1);
export const relationIdSchema = z.number().int().positive();
export const isReadSchema = z.boolean().optional();

export const createdAtSchema = z.date();
export const updatedAtSchema = z.date();
