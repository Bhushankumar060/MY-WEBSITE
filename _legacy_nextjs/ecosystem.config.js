module.exports = {
  apps: [
    {
      name: "tradesovereign-production",
      script: "npm",
      args: "run start -- -p 3000",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        NEXTAUTH_URL: "https://tradesovereign.com",
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
