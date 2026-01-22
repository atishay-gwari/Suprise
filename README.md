# 🏰 Leps' Chronicles of WonderCore

A magical 3D Valentine's Day adventure game!

## 🚀 Deploy on DigitalOcean Droplet

### Step 1: Create a Droplet

1. Go to [DigitalOcean](https://cloud.digitalocean.com)
2. Click **Create** → **Droplets**
3. Choose:
   - **Image:** Ubuntu 22.04 LTS
   - **Plan:** Basic $4/month (smallest is fine!)
   - **Region:** Choose closest to you
   - **Authentication:** Password (easier) or SSH Key
4. Click **Create Droplet**
5. Copy the **IP address**

### Step 2: Connect to Your Droplet

```bash
ssh root@YOUR_DROPLET_IP
```

### Step 3: Install Git & Docker

```bash
# Update system
apt update && apt upgrade -y

# Install Git
apt install git -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Install Docker Compose
apt install docker-compose -y
```

### Step 4: Clone and Deploy

```bash
# Clone the repo
git clone https://github.com/atishay-gwari/Suprise.git

# Go into the folder
cd Suprise

# Build and run with Docker
docker-compose up -d --build
```

### Step 5: Done! 🎉

Your game is now live at:
```
http://YOUR_DROPLET_IP
```

Share this link with Leps! 💕

---

## 🛠 Useful Commands

```bash
# Check if running
docker ps

# View logs
docker-compose logs

# Restart
docker-compose restart

# Stop
docker-compose down

# Update after changes
git pull
docker-compose up -d --build
```

---

## 🎮 Game Controls

- **WASD** - Move
- **SPACE** - Jump
- **E** - Interact
- **🎵 Button** - Toggle music

## 💡 Tips

- In Scene 2, type **"Tsushi"** to call for help!
- The "No" button runs away 😄

---

💕 Happy Valentine's Day, Leps!
