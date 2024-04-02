import dotevn from "dotenv";

async function globalSetup() {
  if (process.env.test_env) {
    dotevn.config({ path: `.env.${process.env.test_env}`, override: true });
  }
}
export default globalSetup;
