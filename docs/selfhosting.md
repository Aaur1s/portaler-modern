# Selfhosting Portaler

## Requirements

**If you want to use Portaler locally on your PC**: Any kind of Linux VM on your network where you have root privileges and can access the terminal. The simplest solution is using something like VirtualBox (google how to do that, it is easy)

**If you want to use Portaler publicly (host)**: Same as using it locally, but you will also need a public routable(preferably static) ip-address and a domain name you own. You can (and probably should) also use a VPS instead of a VM on your PC for that.

This guide was written for Ubuntu 20.04, so I suggest you to use it.

## Installation

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
curl -sL https://deb.nodesource.com/setup_18.x | bash -
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
git clone -b stable-ts https://github.com/aut1sto/portaler-modern
```
Install all yarn dependencies:

```Shell
cd /usr/local/etc/docker-portaler/portaler-modern
yarn install
```

### Explanation about domain names structure

To host Portaler publicly you ofc need domain. You can host portaler without subdomain, link will be like **https://portaler.org/** or, you can host it with subdomain if you want, link will be like **https://public.portaler.org/**

In the steps to follow I'll be using "YOURHOSTDOMAIN" as substitutes for the domain and subdomain names you own. The following part of the guide assumes you know already how hosting a website and stuff like DNS work and realize what domain/subdomain names are.
For example, YOURHOSTDOMAIN for https://public.portaler.org/ is public.portaler.org.

If you are hosting this on your own machine via vmware/virtualbox or on a linux machine in your local network, "YOURHOSTDOMAIN" will be **localhost**.

Now that we have this settled lets build our frontend:

```Shell
cd /usr/local/etc/docker-portaler/portaler-modern
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
    root   /usr/local/etc/docker-portaler/portaler-modern/packages/frontend/build/;
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

(If you are hosting this on your own local machine, skip this step entirely, and jump all the way down to the discord bot section)

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
    root   /usr/local/etc/docker-portaler/portaler-modern/packages/frontend/build/;
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
For the **localhost** version, your redirect url will instead be http://localhost:80/api/auth/callback.

You will need **ClientID**, **ClientSecret**, **PublicKey** from the "General Information" page and **Token** from the "Bot" page for the next step.

Now that you have those values you can set up your docker containers:

```Shell
cd /usr/local/etc/docker-portaler/portaler-modern/docker
nano .env.example
```

You need to edit those values:

**HOST=** to YOURHOSTDOMAIN (ex. myserver.com or yoursubdomain.myserver.com) 

**ACCESS_TOKEN=** to your github access token you've created in the beginning.

**DISCORD_REDIRECT_URI=** https://YOURHOSTDOMAIN:443/api/auth/callback (same stuff you've put into the Discord OAuth page)

**DISCORD_BOT_TOKEN=** Token from "Bot" page.

**DISCORD_PUBLIC_TOKEN**= PublicKey from "General Information" page.

**DISCORD_CLIENT_TOKEN**= ClientID from "General Information" page.

**DISCORD_SECRET_TOKEN**= ClientSecret from "General Information" page.

**DISCORD_SERVER_ID**= ID of your discord server, only for this server ID auth will work. You can find this under "Server settings > Widgets".

**DISCORD_ROLE**= Name of role that will be created when bot join your server. If you want to attach bot to existing role type name of role that you want to attach here.

**DB_HOST**= Normally it can be left to the default "localhost", but if you run into issues where the /api/auth/callback leads to a 404, you can put in the internal IP of the host running the instance. To find that out, you can run the command  ```hostname -I | cut -f1 -d' '```.

Leave everything else as is.

`ctrl-x` to exit, don't forget to save your changes.

## **Important: do NOT invite your bot to your server before you are done setting up docker containers. The bot has to join you discord server with api already running. If your bot is already on your server - kick it.**

When you are done editing the files - start the containers

```Shell
docker-compose up -d
```

If you realized that you've done something wrong you can simply edit `.env.example` or `docker-compose.yml` and `docker-compose up -d` again.

After the process is done restart internal api (for `*container name*`, the default is typically `docker_portaler-ts-backend_1`):
```Shell
docker exec *container_name* sh ./restart_api.sh
```

Now you can invite your bot to your server:

1) You can open link https://YOURHOSTDOMAIN/api/bot in browser, and it will redirect you to bot invite page.
2) Or you can just generate link yourself, it's up to you ofc.

The bot should've created a new role called **portaler** or whatever you've set in your `.env.example` Grant this role to yourself.

Open your browser and go to https://YOURHOSTDOMAIN/ and login, portaler should work properly now, thx for using this guide!

If you have any questions or something isn't working feel free to ask these questions in Portaler Dev discord server:
https://discord.com/invite/3GwNSgvR5g
