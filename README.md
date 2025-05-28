> ⭐ **If you find this script useful, please consider giving it a star — it helps a lot!**  
> ![GitHub Repo stars](https://img.shields.io/github/stars/Kyaa-A/uranium-auto-explorer?style=social)

# ☢️ Uranium Auto Explorer + Detector

A Tampermonkey userscript that **automatically explores Uranium world tiles** and **highlights rare events or items** — perfect for idle grinding and rare item detection.

---

## 📦 Features

- ✅ Automatically clicks through tiles for passive exploration  
- 🧭 Detects and highlights rare drops or events (e.g., gems, NPCs, artifacts)  
- ⏱️ Adjustable delay between tile explorations  
- ⌨️ Press **E** to toggle auto-exploration on/off  
- 🌐 Works on [Uranium's game site]()

---

## 🧠 How It Works

- Simulates user clicks to explore adjacent tiles  
- Watches for specific DOM elements or messages indicating rare finds  
- Displays alerts or highlights when something notable is found  
- Press **`E` key** anytime to pause/resume automation

---

## 🚀 Installation

> 🧩 Requires [Tampermonkey](https://www.tampermonkey.net/) installed in your browser.

1. Install Tampermonkey if you haven’t already.  
2. Click the link below to install the script:

👉 **[Install the script via GitHub](https://raw.githubusercontent.com/Kyaa-A/uranium-auto-explorer/main/uranium-auto-explorer.user.js)**

3. Open Uranium and start exploring effortlessly.

---

## ⚙️ Configuration (Optional)

You can customize the behavior by editing these lines in the script:

```js
const exploreDelay = 2000; // Time between tile clicks (in ms)
const rareKeywords = ["gem", "artifact", "boss"]; // Keywords to detect rare finds
