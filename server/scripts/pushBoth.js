// // scripts/pushBoth.js
// const { execSync } = require("child_process");

// const LOCAL_DB = "postgresql://postgres:Deepak@123@localhost:5432/ImageHub";
// const NEON_DB = "postgresql://ImageHub_owner:npg_XvcY8z3twqhC@ep-yellow-violet-a4crhkkc-pooler.us-east-1.aws.neon.tech/ImageHub?sslmode=require";

// const runPush = (dbUrl, name) => {
//   console.log(`\n⏳ Pushing to ${name}...`);
//   try {
//     execSync(`DATABASE_URL="${dbUrl}" npx drizzle-kit push --config=src/drizzle.config.ts`, {
//       stdio: "inherit",
//     });
//     console.log(`✅ Successfully pushed to ${name}`);
//   } catch (error) {
//     console.error(`❌ Failed to push to ${name}`);
//   }
// };

// runPush(LOCAL_DB, "Local DB");
// runPush(NEON_DB, "Neon DB");





const { execSync } = require("child_process");

const DRIZZLE_COMMAND = "npx drizzle-kit push --config=src/drizzle.config.ts";

const dbs = [
  {
    name: "Local DB",
    url: "postgresql://postgres:Deepak@123@localhost:5432/ImageHub",
  },
  {
    name: "Neon DB",
    url: "postgresql://ImageHub_owner:npg_XvcY8z3twqhC@ep-yellow-violet-a4crhkkc-pooler.us-east-1.aws.neon.tech/ImageHub?sslmode=require",
  },
];

dbs.forEach(({ name, url }) => {
  console.log(`\n⏳ Pushing to ${name}...`);
  try {
    execSync(DRIZZLE_COMMAND, {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: url,
      },
    });
    console.log(`✅ Successfully pushed to ${name}`);
  } catch {
    console.error(`❌ Push failed for ${name}`);
  }
});
