import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  json,
  uniqueIndex,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

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
  refresh_token: text("refresh_token"),
  accountId: uuid("account_id")
    .references((): any => accounts.accountId, { onDelete: "cascade" })
    .notNull(),
  // 🚀 This ensures that when an account is deleted, the user is also deleted

  roleId: uuid("role_id") // Reference roles table
    .notNull()
    .references(() => roles.roleId, { onDelete: "set null" })
    .notNull(),
  invitedBy: uuid("invited_by").references((): any => users.userId, {
    onDelete: "set null",
  }),
  product_environments: text("product_environments").array(), // ??this have the environment value which is cloud name/cloud display name
  userType: text("user_type", {
    enum: ["orgnization", "inviteOnly"],
  }).default("orgnization"), //?? when user directally signup then it is choosen as organization
  userStatus: text("user_status", { enum: ["active", "suspended"] }).default(
    "active"
  ),
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



export const emailVerificationTokens = pgTable('email_verification_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id').notNull().references(() => users.userId, { onDelete: 'cascade' }),

  accountId: uuid('account_id').references(() => accounts.accountId, { onDelete: 'set null' }),
  email: varchar('email', { length: 255 }).notNull(),
  token: text('token').notNull(),

  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),

  isUsed: boolean('is_used').default(false).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
},(table) => {
  return {
    uniqueUserAccount: unique().on(table.userId, table.accountId),
  }}
);
export const PasswordResetToken = pgTable('email_verification_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id').notNull().references(() => users.userId, { onDelete: 'cascade' }),

  accountId: uuid('account_id').references(() => accounts.accountId, { onDelete: 'set null' }),
  email: varchar('email', { length: 255 }).notNull(),
  token: text('token').notNull(),

  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),

  isUsed: boolean('is_used').default(false).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
},
(table) => {
  return {
    uniqueUserAccount: unique().on(table.userId, table.accountId),
  }}
);
// 🔹 Accounts Table
export const accounts = pgTable("accounts", {
  accountId: uuid("account_id").primaryKey().defaultRandom(),
  accountStatus: text("account_status", {
    enum: ["active", "inactive", "suspended"],
  })
    .notNull()
    .default("active"),
  invitedIds: uuid("invited_ids")
    .array()
    .notNull()
    .default(sql`ARRAY[]::uuid[]`),
  settings: json("settings")
    .notNull()
    .default({ theme: "light", language: "en" }),
  preferences: json("preferences").default({
    intrest: "",
    companyName: "",
    domain: "",
  }),
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

export const apiKeys = pgTable("api_keys", {
  apiKeyId: uuid("api_key_id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .references(() => accounts.accountId, { onDelete: "cascade" })
    .notNull(),
  apiKey: text("api_key").notNull().unique(),
  apiSecret: text("api_secret").notNull(), // Securely hashed
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const resources = pgTable("resources", {
  resourceId: uuid("resource_id").primaryKey().defaultRandom(),

  accountId: uuid("account_id")
    .references(() => accounts.accountId, { onDelete: "cascade" })
    .notNull(),

  parentResourceId: uuid("parent_resource_id").references(
    (): any => resources.resourceId,
    { onDelete: "cascade" }
  ),

  type: text("type", { enum: ["bucket", "folder", "file"] }).notNull(),

  name: text("name").notNull(),
  displayName: text("display_name"), // it is only used for bucket , not for folder and files

  path: text("path").notNull(), // Ensures correct hierarchy tracking

  visibility: text("visibility", {
    enum: ["private", "public", "restricted"],
  })
    .notNull()
    .default("private"),

  inheritPermissions: boolean("inherit_permissions").notNull().default(true), // NEW: Auto-propagates permissions
  overridePermissions: boolean("override_permissions").default(false), // NEW: Allows specific overrides

  metadata: json("metadata").default({}), // Flexible for size, format, etc.
  resourceTypeDetails: json("resource_type_details").default({}), // NEW: E.g., file size, dimensions

  versionId: text("version_id"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),

  status: text("status", { enum: ["active", "archived", "deleted"] }) // NEW: Helps manage lifecycle
    .notNull()
    .default("active"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  // ✅(When useful: deletedAt) -> AWS S3 doesn’t automatically delete versions when you delete a file unless versioning is turned off. Soft deletion aligns well with S3’s lifecycle control.
  // Accidental Deletion Protection,
  //Audit & Logging
  // Offering an “Undo” feature or a “Recycle Bin” for temporarily deleted files is easier with soft deletion.
  deletedAt: timestamp("deleted_at", { withTimezone: true }), // NEW: Soft delete
});

// <<<===================Below thing use when we want to apply individula file/resource permission provide when it public =================>>>>

// To grant private resource access to specific users while maintaining your efficient path-based permission system, you can introduce an access control table that defines granular permissions for users.

// export const resourcePermissions = pgTable("resource_permissions", {
//   permissionId: uuid("permission_id").primaryKey().defaultRandom(),
//   resourceId: uuid("resource_id")
//     .references(() => resources.resourceId, { onDelete: "cascade" })
//     .notNull(),
//   userId: uuid("user_id")
//     .references(() => users.userId, { onDelete: "cascade" })
//     .notNull(),
//   accessLevel: text("access_level", { enum: ["read", "write", "admin"] }).notNull(),
//   createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
//   updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
// });

// --------------------------->>>>>>>>>>>>>>>>>>

// await db.insert(resourcePermissions).values({
//   resourceId: 'folder2-id', // The resource you want to grant access to
//   userId: 'user-id-123',
//   accessLevel: 'read' // 'read', 'write', or 'admin'
// });

// -------------------->>>>>>>

// SELECT
//     r.is_public,
//     rp.access_level
// FROM resources r
// LEFT JOIN resource_permissions rp
//     ON r.resource_id = rp.resource_id
//     AND rp.user_id = 'user-id-123'
// WHERE r.path ILIKE '/folder1/folder2/folder3/file3.jpg'
//    OR r.path ILIKE '/folder1/folder2/folder3%'
//    OR r.path ILIKE '/folder1/folder2%'
//    OR r.path ILIKE '/folder1%'
// ORDER BY LENGTH(r.path) DESC
// LIMIT 1;

// <<<<<<<<<<= =================== =======       ======== =======================>>>>
