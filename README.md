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
