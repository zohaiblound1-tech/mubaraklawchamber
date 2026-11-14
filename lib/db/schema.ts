import { boolean, date, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const cases = pgTable('cases', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  caseNumber: text('case_number').notNull(),
  court: text('court').notNull(),
  bench: text('bench').notNull(),
  category: text('category').notNull(),
  status: text('status').notNull(),
  filedOn: date('filed_on'),
  decidedOn: date('decided_on'),
  summary: text('summary').notNull(),
  details: text('details').notNull().default(''),
  isLandmark: boolean('is_landmark').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const casePhotos = pgTable('case_photos', {
  id: serial('id').primaryKey(),
  caseId: integer('case_id')
    .notNull()
    .references(() => cases.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  caption: text('caption').notNull().default(''),
  position: integer('position').notNull().default(0),
});

export const consultations = pgTable('consultations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull().default(''),
  matterType: text('matter_type').notNull().default(''),
  preferredDate: text('preferred_date').notNull().default(''),
  message: text('message').notNull(),
  status: text('status').notNull().default('New'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
