# 🐙 GitHub Setup for Beginners

This guide will help you set up GitHub and deploy your CSV to NetSuite app.

## 🎯 Why Use GitHub?

- **Backup your code** - never lose your work
- **Learn industry skills** - every developer uses Git/GitHub
- **Easy deployments** - most platforms connect to GitHub
- **Version control** - track changes and roll back if needed
- **Collaboration** - share code with others

---

## 📋 Step-by-Step GitHub Setup

### Step 1: Create GitHub Account

1. Go to [github.com](https://github.com)
2. Click "Sign up" (it's free!)
3. Choose a username (this will be your GitHub URL)
4. Verify your email address

### Step 2: Install Git (if not already installed)

**For Mac:**
```bash
# Git usually comes pre-installed, but if not:
brew install git
```

**Check if Git is installed:**
```bash
git --version
```

### Step 3: Configure Git with Your Info

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your-email@example.com"
```

### Step 4: Create a New Repository on GitHub

1. Go to [github.com](https://github.com)
2. Click the "+" button in the top right
3. Click "New repository"
4. Name it: `csv-to-netsuite-converter`
5. Make sure it's **Public** (free accounts get unlimited public repos)
6. **Don't** check "Initialize with README" (we already have files)
7. Click "Create repository"

### Step 5: Connect Your Local Project to GitHub

**In Terminal, run these commands:**

```bash
# Navigate to your project folder
cd /Users/parkergilbert/Cursor

# Initialize Git repository (if not already done)
git init

# Add all your files
git add .

# Make your first commit
git commit -m "Initial commit: CSV to NetSuite journal converter"

# Connect to your GitHub repository
git remote add origin https://github.com/YOUR-USERNAME/csv-to-netsuite-converter.git

# Push your code to GitHub
git push -u origin main
```

**Replace `YOUR-USERNAME` with your actual GitHub username!**

---

## 🚀 Deploy from GitHub

Now that your code is on GitHub, deployment is super easy:

### Method 1: Heroku with GitHub

1. **Connect Heroku to GitHub:**
   ```bash
   heroku create your-csv-converter
   ```

2. **Go to your Heroku dashboard:**
   - Visit [dashboard.heroku.com](https://dashboard.heroku.com)
   - Click on your app
   - Go to "Deploy" tab
   - Click "Connect to GitHub"
   - Search for your repository
   - Click "Connect"

3. **Enable automatic deployments:**
   - In the "Deploy" tab
   - Click "Enable Automatic Deploys"
   - Choose the `main` branch
   - Click "Deploy Branch"

**Now every time you push to GitHub, your app automatically updates!**

### Method 2: Vercel (Even Easier)

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import from GitHub
4. Select your repository
5. Click "Deploy"

**Done! Your app is live in 2 minutes!**

---

## 🔄 Making Updates

Now when you want to update your app:

1. **Make changes to your code**
2. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Added new feature"
   git push origin main
   ```
3. **Your app automatically updates** (if using automatic deployment)

---

## 🎉 Benefits of This Approach

✅ **Your code is backed up** on GitHub  
✅ **Easy to share** your project  
✅ **Automatic deployments** when you make changes  
✅ **Learn industry-standard tools**  
✅ **Professional development workflow**  

---

## 🆘 Troubleshooting

### "Repository not found"
- Make sure you're using the correct GitHub username
- Check that the repository name matches exactly

### "Permission denied"
- You might need to authenticate with GitHub
- Try: `gh auth login` (if you have GitHub CLI installed)

### "Branch main does not exist"
- Your default branch might be "master" instead of "main"
- Try: `git push -u origin master`

---

## 🎯 Quick Commands Reference

```bash
# Check status
git status

# Add files
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# See your GitHub repository
git remote -v
```

---

**🎊 Congratulations! You now have professional-grade version control set up!**
