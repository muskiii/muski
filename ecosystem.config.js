module.exports = {
  apps: [{
    name: 'muski',
    script:  'nodemon ./server.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: '52.43.118.42',
      key: '~/.ssh/AWSmuskiprivatekey.pem',
      ref: 'origin/development',
      repo: 'https://github.com/muskiii/muski.git',
      path: '/home/ubuntu/development',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
