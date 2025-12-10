module.exports = {
  apps: [
    {
      name: "premind",
      script: "index.js",
      env_development: {
        NODE_ENV: "development"
      }
    }
  ]
};