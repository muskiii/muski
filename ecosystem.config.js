module.exports = {
  apps: [{
    name: 'muski',
    script: 'server.js',
    env: {
      "PORT": 3000,
      "NODE_ENV": "dev"
    },
    env_production: {
      "PORT": 4000,
      "NODE_ENV": "prod"
    }
  }],
  deploy: {
    dev: {
      user : 'ubuntu',
      host : '52.43.118.42',
      key: '~/.ssh/AWSmuskiprivatekey.pem',
      ref: 'origin/development',
      repo : 'git@github.com:muskiii/muski.git',
      path : '/home/ubuntu/development/muski',
      'post-deploy' : 'npm install && pm2 startOrRestart ecosystem.config.js'      
    },
    production: {
      user: 'ubuntu',
      host: '52.43.118.42',
      key: '~/.ssh/AWSmuskiprivatekey.pem',
      ref: 'origin/master',
      repo: 'git@github.com:muskiii/muski.git',
      path: '/home/ubuntu/production/muski',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js --env production'
    }    
  }
}
