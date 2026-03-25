module.exports = {
  apps: [{
    name: "tradesovereign-backend",
    script: "server.js",
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
