const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "db.cfwxclgwqtrcweszpzdt.supabase.co",
  database: "postgres",
  password: "8c3lfEc1SpkAPBGz",
  port: 5432,
});

module.exports = pool;
