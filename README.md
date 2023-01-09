# Online TV streaming server

This project creates a simple online TV server using RTMP for video stream and a web server for streaming it on a website.

## Development state

Early development phase, not intended for production deployment. Please see [**TODO**](./TODO.md) file.

## Installation

These are the installation instructions of this software for the different Linux distributions.

**IMPORTANT NOTE**: It is recommended to install this software on a clean OS installation, otherwise it may cause that other software previously installed on your server could stop working properly due to this. You are using this software at your own risk.

### Debian / Ubuntu Linux

Log in as "root" on your server and run the following commands to download the necessary dependencies and the latest version of this software from GitHub:

```console
apt update
apt -y upgrade
apt -y install curl git screen certbot
curl -sL https://deb.nodesource.com/setup_19.x | bash -
apt -y install nodejs
git clone https://github.com/libersoft-org/online-tv-server.git
cd online-tv-server/src/
npm i
```

### CentOS / RHEL / Fedora Linux

Log in as "root" on your server and run the following commands to download the necessary dependencies and the latest version of this software from GitHub:

```console
dnf -y update
dnf -y install curl git screen certbot
curl -sL https://rpm.nodesource.com/setup_19.x | bash -
dnf -y install nodejs
git clone https://github.com/libersoft-org/online-tv-server.git
cd online-tv-server/src/
npm i
```

## Configuration

**1. After the installation is completed, you need to get a HTTPS certificate for your server.**

```console
certbot certonly --standalone --register-unsafely-without-email --agree-tos -d tv.domain.tld
```

(replace **tv.domain.tld** with your server domain address)

**2. To set up the certificate auto renewal edit crontab using:**

```console
crontab -e
```

... and add this line at the end:

```console
0 12 * * * /usr/bin/certbot renew --quiet
```

**3. Put your video files you'd like to stream in "video" folder**

Using the **mp4** format with **H.264** video codec and **AAC** audio codec is recommended.

**4. Add the videos in your streaming list:**

Open the file called **video.json** and replace / add the names of your video files you'd like to stream.

## Start the server

Now you can just start the server using:

```console
node index.js
```

If you start it for the first time, the new settings file called **settings.json** is created and it will ask you for the domain name of your server. This will modify a path to your HTTPS certificate in the settings file.

To stop the server just press **CTRL+C**.

If you'd like to start the server on background in screen, use this command:

```console
./start.sh
```

You can attach the server screen using:

```console
screen -x tv
```

To detach screen press **CTRL+A** and then **CTRL+D**.

## Play your online TV

You can view your online TV using:

- **Web browser** - just navigate to your online TV website (for example: **https://tv.domain.tld/**) - you should see your video now.

If you have changed the HTTPS port in settings file, you need to use the address in this format: **https://tv.domain.tld:444/** (where 444 represents the HTTPS port)

If you have changed the RTMP port in settings file, you need to edit the "functions.js" file in "www/tv/" folder and replace the in RTMP port in rtmp:// address.

- **Media player** - Start your media player (for example VLC Media Player) open the network stream, input the address of your online TV server in this format: **rtmp://tv.domain.tld:1935/tv** (where 1935 represents the network port you're using - you can find this network port in server settings file)

## License
- This software is developed as open source under [**Unlicense**](./LICENSE).
