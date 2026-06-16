import app from "./index";

const port = parseInt(process.env.PORT || "3010", 10);
console.log(`Server starting on port ${port}...`);

export default {
  fetch: app.fetch,
  port,
};

console.log(`Server should be running on port ${port}`);
