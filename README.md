# 🤓 Programmer Nerd Scorecard

How nerdy is your programming setup? Take the ultimate test to measure your dedication to terminal-first workflows, self-hosting, custom keyboards, and all things über-nerd.

## 🚀 Live Demo

[Visit the live scorecard](#) *(Add your GitHub Pages URL here)*

## ✨ Features

- **Progressive difficulty** - Questions scale from beginner-friendly to absolute madlad territory
- **11 categories** covering everything from keyboard layouts to kernel compilation
- **Real-time scoring** - See your nerdiness level update as you check boxes
- **Persistent state** - Your answers are saved in localStorage
- **Shareable scores** - Share your rank with others
- **Mobile-friendly** - Works great on all devices
- **Zero dependencies** - Pure HTML, CSS, and vanilla JavaScript (except YAML parser)

## 🎯 Scoring System

- **0-50 points**: Curious Normie - Welcome to the rabbit hole
- **51-150 points**: Enthusiast - You've caught the optimization bug
- **151-300 points**: Power User - Your colleagues ask you for help
- **301-500 points**: Wizard - You ARE the local tech support
- **501-750 points**: Arch Mage - People DM you their configs
- **751-1000 points**: Ascended - You've merged with the machine
- **1000+ points**: Grass? What's grass? - Please go outside

**Maximum possible score: ~1,645 points**

## 🛠️ Setup for GitHub Pages

### Option 1: Fork this repository

1. Fork this repository
2. Go to Settings → Pages
3. Set Source to "Deploy from a branch"
4. Select `main` branch and `/root` folder
5. Save and wait for deployment
6. Visit `https://yourusername.github.io/nerd-scorecard`

### Option 2: Clone and deploy

```bash
# Clone the repository
git clone https://github.com/yourusername/nerd-scorecard.git
cd nerd-scorecard

# The site is ready to deploy - just commit and push to GitHub
git add .
git commit -m "Initial commit"
git push origin main
```

### Option 3: Local development

Simply open `index.html` in your browser. However, you'll need to run a local web server to avoid CORS issues when loading the YAML file:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (with npx)
npx http-server

# Then visit http://localhost:8000
```

## 📝 Contributing

We welcome contributions! Here's how to add questions or improve the scorecard:

### Adding New Questions

1. Edit `nerd-scorecard.yaml`
2. Add your question to the appropriate category
3. Follow this format:

```yaml
- id: unique-question-id
  text: "Your question text here"
  points: 15
```

**Guidelines for questions:**
- Use kebab-case for IDs (e.g., `built-custom-kernel`)
- Points should reflect difficulty/rarity (5-40 points typical range)
- Questions should be objective (yes/no) rather than subjective
- Avoid gatekeeping - aspirational but achievable
- Keep text concise and clear
- No mutually exclusive questions

### Adding New Categories

Add a new category to `nerd-scorecard.yaml`:

```yaml
- name: "Your Category Name"
  description: "Brief description of what this covers"
  questions:
    - id: question-one
      text: "Question text"
      points: 10
```

### Modifying Scoring Tiers

Edit the `scoring_tiers` section in `nerd-scorecard.yaml`:

```yaml
scoring_tiers:
  - min: 0
    max: 50
    title: "Your Rank Title"
    description: "Rank description"
```

## 🎨 Customization

### Styling

Edit `style.css` to change the theme. The site uses CSS variables for easy color customization:

```css
:root {
    --bg-primary: #0d1117;
    --accent: #58a6ff;
    /* ... modify these */
}
```

### Behavior

Edit `app.js` to modify functionality. Key functions:
- `loadConfig()` - Loads YAML configuration
- `updateScore()` - Updates the score display
- `shareScore()` - Generates shareable text

## 📂 File Structure

```
nerd-scorecard/
├── index.html              # Main HTML page
├── style.css               # Styles (GitHub dark theme inspired)
├── app.js                  # Application logic
├── nerd-scorecard.yaml     # Questions and configuration
└── README.md               # This file
```

## 🤝 Contributing Guidelines

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b add-new-questions`)
3. **Edit** `nerd-scorecard.yaml` with your additions
4. **Test** locally to ensure nothing breaks
5. **Commit** your changes with clear messages
6. **Push** to your fork
7. **Open** a Pull Request with a description of what you added

### PR Tips
- One PR per category of changes (e.g., "Add keyboard questions" vs "Add 50 random questions")
- Explain your reasoning for point values
- Test that the YAML is valid (no syntax errors)
- Keep the spirit of the project: fun, inclusive, aspirational

## 🐛 Bug Reports

Found a bug? [Open an issue](https://github.com/yourusername/nerd-scorecard/issues) with:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 📜 License

MIT License - feel free to fork, modify, and share!

## 🙏 Credits

Created by the terminal-dwelling, rice-posting, dotfile-obsessing community. 

Inspired by countless hours spent in:
- r/unixporn
- r/MechanicalKeyboards  
- The Arch Wiki
- Late-night config tweaking sessions

## 🌟 Show Your Support

If you enjoy this project:
- ⭐ Star this repository
- 🍴 Fork it and make your own version
- 📢 Share your score on social media
- 🤝 Contribute new questions

---

**Remember**: The real treasure is the configs we made along the way. Now go touch some grass! 🌱
