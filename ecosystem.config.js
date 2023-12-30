const PUBLIC_CONFIG = {
  log_date_format: 'YYYY-MM-DD HH:mm:ss',
  autorestart: true,
  max_memory_restart: '1G',
  instances: 1,
  exec_mode: 'cluster',
};

module.exports = {
  apps: [
    {
      name: 'deep-cms',
      script: './dist/apps/deep-cms/main.js',
      error_file: './logs/deep-cms/pm2-err.log',
      out_file: './logs/deep-cms/pm2-out.log',
      env_prod: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
      ...PUBLIC_CONFIG,
    },
    {
      name: 'deep-backend',
      script: './dist/apps/deep-backend/main.js',
      error_file: './logs/deep-backend/pm2-err.log',
      out_file: './logs/deep-backend/pm2-out.log',
      env_prod: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
      ...PUBLIC_CONFIG,
    },
    {
      name: 'deep-auth',
      script: './dist/apps/deep-auth/main.js',
      error_file: './logs/deep-auth/pm2-err.log',
      out_file: './logs/deep-auth/pm2-out.log',
      env_prod: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      ...PUBLIC_CONFIG,
    },
  ],
};
