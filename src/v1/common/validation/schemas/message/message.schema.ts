import z from 'zod';

export const messageIdSchema = z.number().int().positive();
export const messageOwnerIdSchema = z.number().int().positive();
export const messageContentSchema = z.string().min(1);
export const messageRelationIdSchema = z.number().int().positive();
export const messageIsReadSchema = z.boolean().optional();

export const messageCreatedAtSchema = z.date();
export const messageUpdatedAtSchema = z.date();
