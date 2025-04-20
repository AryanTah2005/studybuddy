// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { boolean, index, integer, json, pgTableCreator, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `study_tool_${name}`);

export const todo = createTable(
  "todo",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    title: varchar("title", { length: 256 }),
    done: boolean("done").default(false),
    user_id: varchar("user_id", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.title),
  }),
);

export const courses = createTable(
  "course",
  {
    record_id: integer("record_id").primaryKey().generatedByDefaultAsIdentity(),
    course_id: uuid("course_id").notNull().defaultRandom(),
    course_name: varchar("course_name", { length: 256 }),
    course_desc: text("course_desc").default(sql`''`),
    is_active: boolean("is_active").default(true),
    user_id: varchar("user_id", { length: 256 }),
    uploaded_files: json("uploaded_files").default(sql`'[]'`),
    uploaded_files_count: integer("uploaded_files_count").default(0),
    uploaded_files_size: integer("uploaded_files_size").default(0),
    generated_files: json("generated_files").default(sql`'[]'`),
    generated_files_count: integer("generated_files_count").default(0),
    generated_files_size: integer("generated_files_size").default(0),
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
);
