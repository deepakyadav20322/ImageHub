import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  json,

  uniqueIndex,
} from "drizzle-orm/pg-core";

// 🔹 Roles Table (to normalize role names)
export const roles = pgTable("roles", {
  roleId: uuid("role_id").primaryKey().defaultRandom(),
  name: text("name", {
    enum: ["super_admin", "admin", "user", "viewer", "editor"],
  })
    .notNull()
    .unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 🔹 Users Table
export const users = pgTable("users", {
  userId: uuid("user_id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password"), // Optional for Google users
  emailVerified: boolean("email_verified").notNull().default(false),
  googleId: text("google_id").unique(), // Google OAuth users
  roleId: uuid("role_id") // Reference roles table
    .notNull()
    .references(() => roles.roleId, { onDelete: "set null" }),
  inviteStatus: text("invite_status", {
    enum: ["pending", "accepted", "expired"],
  }).default("pending"),
  invitedBy: uuid("invited_by").references((): any => users.userId, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastLogin: timestamp("last_login", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 🔹 Accounts Table
export const accounts = pgTable("accounts", {
  accountId: uuid("account_id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  roleId: uuid("role_id")
    .notNull()
    .references(() => roles.roleId, { onDelete: "cascade" }),
  accountType: text("account_type", { enum: ["personal", "organization"] })
    .notNull()
    .default("personal"),
  accountStatus: text("account_status", {
    enum: ["active", "inactive", "suspended"],
  })
    .notNull()
    .default("active"),
  inviteToken: text("invite_token").unique(),
  inviteExpiresAt: timestamp("invite_expires_at", { withTimezone: true }),
  settings: json("settings")
    .notNull()
    .default({ theme: "light", language: "en" }),
  provider: text("provider"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  twitterProfile: text("twitter_profile"),
  facebookPage: text("facebook_page"),
  companyName: text("company_name"),
  website: text("website"),
  phone: text("phone"),
  gettingStarted: boolean("getting_started").notNull().default(false),
  signupSource: text("signup_source").notNull().default("Unknown"),
});

// 🔹 Invites Table
export const invites = pgTable("invites", {
  inviteId: uuid("invite_id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  inviterId: uuid("inviter_id")
    .notNull()
    .references(() => users.userId, { onDelete: "cascade" }),
  roleId: uuid("role_id")
    .notNull()
    .references(() => roles.roleId, { onDelete: "cascade" }),
  status: text("status", { enum: ["pending", "accepted", "expired"] })
    .notNull()
    .default("pending"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 🔹 Permissions Table
export const permissions = pgTable("permissions", {
  permissionId: uuid("permission_id").primaryKey().defaultRandom(),
  resource: text("resource").notNull(), // e.g., "user", "asset", "account"
  action: text("action").notNull(), // e.g., "create", "read", "update", "delete"
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// 🔹 Role-Permissions (Many-to-Many)
export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.roleId, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.permissionId, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    uniqueIndex: uniqueIndex("unique_role_permission").on(
      table.roleId,
      table.permissionId
    ),
  })
);
