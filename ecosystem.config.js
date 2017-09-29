module.exports = {
  apps: [{
    name: 'muski',
    script: 'server.js',
    env: {
      COMMON_VARIABLE: 'true'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: '52.43.118.42',
      key: '~/.ssh/AWSmuskiprivatekey.pem',
      ref: 'origin/development',
      repo: 'git@github.com:muskiii/muski.git',
      path: '/home/ubuntu/development/muski',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    },
    dev : {
      user : 'ubuntu',
      host : '52.43.118.42',
      key: '~/.ssh/AWSmuskiprivatekey.pem',
      ref: 'origin/development',
      repo : 'git@github.com:muskiii/muski.git',
      path : '/home/ubuntu/production/muski',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }

  }
}
