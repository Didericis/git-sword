# git-sword
Slash dem bugs!

# Deploy

This assumes that you have an AWS EC2 instance running ubuntu.

## Set up EC2 instance

1. Assign an elastic ip to your instance 
2. Setup ssh keys
3. Open ports 80 and 443

## Generate SSL Certificate

#### Create certificate

```bash
git clone https://github.com/letsencrypt/letsencrypt.git
cd letsencrypt
./letsencrypt-auto -d <domain> certonly
```

#### Combine certificate and key

```bash
sudo cat /etc/letsencrypt/live/<domain>/fullchain.pem /etc/letsencrypt/live/<domain>/privkey.pem > ./bundle.pem
```

#### Copy key from EC2 instance (This method requires sshfs)

```
sshfs ubuntu@git-sword: <mountpoint>
cp <mountpoint>/bundle.pem <repo>
```

## Deploy

```bash
mup setup
mup deploy
```
