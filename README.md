# muski
muski api for a variety of apps

sudo apt-get install nginx
sudo /etc/init.d/nginx start
sudo vi /etc/nginx/sites-available/muskiNginx
sudo ln -s /etc/nginx/sites-available/muskiNginx /etc/nginx/sites-enabled/muskiNginx
sudo service nginx restart

sudo npm i -g pm2
pm2 start npm --name "muski" -- run start
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save

# to stop the daemon
pm2 stop index

# Remove it from the list
pm2 delete index

# remove init script
pm2 unstartup systemd

# Deploying code into the server

SSH into your server and generate the key pair.
When prompted, use the default name.
No need for a pass phrase.
ssh-keygen -t rsa
Show the contents of the file
cat ~/.ssh/id_rsa.pub

Whenever you are logged in over SSH, you want the keys to be added so that they are used to authenticate with Github. To do this, add these lines to the top of your ~/.bashrc file.
Start the SSH agent
 eval `ssh-agent -s`
Add the SSH key
 ssh-add id_rsa.pub
 
source ~/.bashrc

Before using PM2, remove the code you just pulled in from git into your server.
rm -rf ~/muski

pm2 ls
Only do this if a task is still running
pm2 delete tutorial
# LOCALY
In your local version of the project, install PM2 globally
npm i -g pm2

Once the file is saved, setup the directories on the remote
pm2 deploy ecosystem.config.js production setup
pm2 deploy ecosystem.config.js production

Once the file is saved, setup the directories on the remote
pm2 deploy ecosystem.config.js dev setup
pm2 deploy ecosystem.config.js dev

# localy start app

dev: npm run-script deploy-dev
prod: npm run-script deploy-prod
