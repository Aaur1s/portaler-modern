# Selfhosting Portaler

## Requirements

**If you want to use Portaler locally on your PC**: Any kind of Linux VM on your network where you have root privileges and can access the terminal. The simplest solution is using something like VirtualBox (google how to do that, it is easy)

**If you want to use Portaler publicly (host)**: Same as using it locally, but you will also need a public routable(preferably static) ip-address and a domain name you own. You can (and probably should) also use a VPS instead of a VM on your PC for that.

This guide was written for Ubuntu 20.04, so I suggest you to use it.

## Steps for both local and public versions

Register at github.com and get a github access token. You can learn how to get it here: [Creating a Personal Access Token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)

You don't need to select any permissions for you token.

When that is done, connect to your server using ssh or, if you can access the gui, launch the terminal.

Root yourself by using `su` (or `sudo -i` if you have sudo installed)

Let's begin by installing some necessary packages you will need.

Install git and curl:

```Shell
apt-get update
apt-get install -y git
apt-get install -y curl
```

Install nodejs/npm and yarn:

```Shell
curl -sL https://deb.nodesource.com/setup_14.x | bash -
apt-get install -y nodejs
npm install --global yarn
```

Install docker and docker-compose:

```Shell
sudo apt-get install ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
apt-get install -y docker-ce docker-ce-cli containerd.io
curl -L "https://github.com/docker/compose/releases/download/1.28.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

Now that you have everything you need installed, let's set everything up:

Pick a folder. For this guide I will be using `/usr/local/etc`

```Shell
mkdir /usr/local/etc/docker-portaler
cd /usr/local/etc/docker-portaler
```

Clone the whole portaler repository:

```Shell
git clone -b beta https://github.com/aut1sto/portaler-core
```
Install all yarn dependencies:

```Shell
cd /usr/local/etc/docker-portaler/portaler-core
yarn install
```

Now you need to decide if you are going to use it locally or publicly. Local version has no auth and is accessible only from your local network. Public version has discord OAuth and can be accessed by anyone with the right role on your discord server. While you can technically make the local version accessible from the internet that is not advised and will not be covered by this guide.

You don't need to do both options so pick only the one you need.

## Option 1 - Steps for local version

Build shared modules:

```Shell
yarn build:shared
```

Edit `docker-compose.yml` and `.env.example`:

```Shell
cd /usr/local/etc/docker-portaler/portaler-core/docker
```

You can use any text editor you like. If you are using Debian you will most likely have `Vim` and `nano` installed. If you've never used `Vim` before, I suggest you use `nano` instead.

If you don't have anything but `Vim` installed - you can either use google-fu and learn how to use it or just `apt-get install -y nano` to have `nano` installed

```Shell
cp .env.example.example .env.example.example.backup
nano .env.example.example
```

Edit those values:

**ACCESS_TOKEN=** Your github access token you've created in the beginning.

Uncomment **DISABLE_AUTH=true** (that means delete the # before this line)

Leave everything else as is.

`ctrl-x` to exit the editor, don't forget to save your changes:

```Shell
nano docker-compose.yml
```

Modify it to be like this:

```yml
version: '3.7'

services:
  pgdb:
    image: postgres:13-alpine
    env_file:
      - .env.example.example
    restart: unless-stopped
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - portaler
  rediscache:
    image: bitnami/redis:6.0
    env_file:
      - .env.example.example
    restart: unless-stopped
    networks:
      - portaler
  api_server:
    image: aut1sto/portaler:beta
    env_file:
      - .env.example.example
    restart: unless-stopped
    ports:
      - '127.0.0.1:7777:4242'
    depends_on:
      - pgdb
      - rediscache
    networks:
      - portaler
  bin_etl:
    image: aut1sto/portaler-etl:beta
    env_file:
      - .env.example.example
    restart: unless-stopped
    depends_on:
      - pgdb
      - rediscache
      - api_server
    networks:
      - portaler

networks:
  portaler:
    driver: 'bridge'

volumes:
  db_data: {}
```

`ctrl-x` to exit, don't forget to save your changes.

When you are done editing the files - start the containers:

```Shell
docker-compose up -d
```

If you realized that you've done something wrong you can simply edit `.env.example` or `docker-compose.yml` and `docker-compose up -d` again.

After the process is done wait for a couple of minutes and check that all containers are up and running:

```Shell
docker ps -a
```

In this list look for **container id** of the container with bin_etl (most likely will be the first one in the list) and restart it. That should populate the DB with zone info.

```Shell
docker restart your_bin_etl_containerid
docker exec your_rediscache_containerid redis-cli -a redis flushall
docker restart your_api_server_containerid
```

Switch to the folder containing frontend files:

```Shell
cd /usr/local/etc/docker-portaler/portaler-core/packages/frontend
```

Rename `.env.example` to `.env`:

```Shell
mv .env.example.example .env.example
```

Install pm2 and make it autostart your webserver:

```Shell
npm install pm2 -g
pm2 start --name=portaler npm -- start
pm2 startup
pm2 save
```

Wait some time for the webserver to start. Now you can open your browser and go to http://yourserverip:3000 to use Portaler.

### Windows Troubleshooting

for the local version on windows double check that

1. you have both python 2 and python 3. and that they are in the path.
   1.1 python2 should open python 2.7 and python should open python 3.whatever
2. make sure you are running all yarn and npm commands in node v 14.20.1 (latest version of node 14)
   on windows that means that you can use the nvm utility to make sure you are utilizing the correct version
3. utilize admin powershell for you're first instalation / setup
4. if after `docker-compose up -d` you do not have a instance of bin-etl running then make sure you were in the /docker/ directory of the project





## Option 2 - Steps for public version

### Explanation about domain names structure

To host Portaler publicly you ofc need domain. You can host portaler without subdomain, link will be like **https://portaler.org/** or, you can host it with subdomain if you want, link will be like **https://public.portaler.org/**

In the steps to follow I'll be using "YOURHOSTDOMAIN" as substitutes for the domain and subdomain names you own. The following part of the guide assumes you know already how hosting a website and stuff like DNS work and realize what domain/subdomain names are.
For example, YOURHOSTDOMAIN for https://public.portaler.org/ is public.portaler.org.

Now that we have this settled lets build our frontend:

```Shell
cd /usr/local/etc/docker-portaler/portaler-core
yarn build:front
```

I suggest using Nginx to serve the webpage, so you need to install it first:

```Shell
apt-get install -y nginx
```

Edit Nginx configuration files. You can use any text editor you like. If you are using Debian you will most likely have `Vim` and `nano` installed. If you've never used `Vim` before, i suggest you use `nano` instead.

If you don't have anything but `Vim` installed - you can either use google-fu and learn how to use it or just `apt-get install nano` to have `nano` installed.

```Shell
nano /etc/nginx/conf.d/portaler.conf
```

Paste this config into the file:

```nginx
server {
  listen 80;
  
  server_name YOURHOSTDOMAIN;
  
  location /api/ {
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header Host           $http_host;
    proxy_pass      http://localhost:7777/api/;
  }

  location / {
    root   /usr/local/etc/docker-portaler/portaler-core/packages/frontend/build/;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  error_page   500 502 503 504  /50x.html;

  location = /50x.html {
    root   /usr/share/nginx/html;
  }
}
```

`ctrl-x` to exit the editor, don't forget to save your changes.

Delete the default configuration and restart nginx:

```Shell
rm /etc/nginx/sites-enabled/default
systemctl restart nginx
```

You should be able to access the website now in your browser (nothing will work however without the backend)

### How to set up SSL

After your portaler instance done you can setup SSL(https://) for your portaler.

Setup certbot to gen SSL certificates:

```Shell
sudo apt install -y snapd
snap install core; sudo snap refresh core
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot
```

After installing is done you need to gen certificates for your domain:

```Shell
certbot certonly --nginx
```

You also need dhparams for SSL:

```Shell
mkdir /etc/letsencrypt/dhparams
openssl dhparam -out /etc/letsencrypt/dhparams/dhparam.pem 2048
```

Now you need to edit your portaler.conf file:

```Shell
nano /etc/nginx/conf.d/portaler.conf
```
(or vim, up to you)

Paste this config(change YOURHOSTDOMAIN with data from your instance):

```nginx
server {
  listen 443 ssl;
  listen [::]:443 ssl;

  server_name YOURHOSTDOMAIN;

  ssl_certificate         /etc/letsencrypt/live/YOURHOSTDOMAIN/fullchain.pem;
  ssl_certificate_key     /etc/letsencrypt/live/YOURHOSTDOMAIN/privkey.pem;
  ssl_trusted_certificate /etc/letsencrypt/live/YOURHOSTDOMAIN/chain.pem;

  ssl_dhparam /etc/letsencrypt/dhparams/dhparam.pem;

  location /api/ {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass      http://localhost:7777/api/;
  }

  location / {
    root   /usr/local/etc/docker-portaler/portaler-core/packages/frontend/build/;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  error_page   500 502 503 504  /50x.html;

  location = /50x.html {
    root   /usr/share/nginx/html;
  }
}
server {
  listen 80;
  server_name YOURHOSTDOMAIN;
  return 301 https://YOURHOSTDOMAIN$request_uri;
}
```
Now, we can restart nginx to apply changes:

```Shell
systemctl restart nginx
```



### Everything discord bot related

You will need to create an application using [discord developer portal](https://discord.com/developers/applications). You can name it however you want.

Go to the "Bot" page and press Add Bot, check **Presence Intent** and **ServerMember Intent**.
On the OAuth2 page press "Add Redirect" and put there https://YOURHOSTDOMAIN:443/api/auth/callback. Don't forget to save changes.

You will need **ClientID**, **ClientSecret**, **PublicKey** from the "General Information" page and **Token** from the "Bot" page for the next step.

Now that you have those values you can set-up your docker containers:

```Shell
cd /usr/local/etc/docker-portaler/portaler-core/docker
nano .env.example.example
```

You need to edit those values:

**HOST=** to YOURHOSTDOMAIN (ex. myserver.com or yoursubdomain.myserver.com)

**ADMIN_KEY=** to a admin key, only for devs but don't leave it 1234.

**ACCESS_TOKEN=** to your github access token you've created in the beginning.

**DISCORD_REDIRECT_URI=** https://YOURHOSTDOMAIN:443/api/auth/callback (same stuff you've put into the Discord OAuth page)

**DISCORD_BOT_TOKEN=** Token from "Bot" page.

**DISCORD_PUBLIC_TOKEN**= PublicKey from "General Information" page.

**DISCORD_CLIENT_TOKEN**= ClientID from "General Information" page.

**DISCORD_SECRET_TOKEN**= ClientSecret from "General Information" page.

**DISCORD_ROLE**= Name of role that will be created when bot join your server. If you want to attach bot to existing role type name of role that you want to attach here.

**DISCORD_SERVER_ID**= ID of your discord server, only for this server ID auth will work.

Leave everything else as is.

`ctrl-x` to exit, don't forget to save your changes.

## **Important: do NOT invite your bot to your server before you are done setting up docker containers. The bot has to join you discord server with api already running. If your bot is already on your server - kick it.**

When you are done editing the files - start the containers

```Shell
docker-compose up -d
```

If you realized that you've done something wrong you can simply edit `.env.example` or `docker-compose.yml` and `docker-compose up -d` again.

After the process is done wait for a couple of minutes and check that all containers are up and running:

```Shell
docker ps -a
```

In this list look for **container id** of the container with bin_etl (most likely will be the first one in the list) and restart it. That should populate the DB with zone info.

```Shell
docker restart your_bin_etl_containerid
docker exec your_rediscache_containerid redis-cli -a redis flushall
docker restart your_api_server_containerid
```

Now you can invite your bot to your server:

1) You can open link https://YOURHOSTDOMAIN/api/bot in browser, and it will redirect you to bot invite page.
2) Or you can just generate link yourself, its up to you ofc.

The bot should've created a new role called **portaler** or whatever you've set in your `.env.example.` Grant this role to yourself.

Open your browser and go to https://YOURHOSTDOMAIN/ and login, portaler should work properly now, thx for using this guide!

If you have any questions or something isn't working feel free to ask these questions in Portaler Dev discord server:
https://discord.com/invite/3GwNSgvR5g
