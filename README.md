# 🌍 Cosmic Architect: Planet Creation Simulation

An interactive 3D web application that lets you design and create your own planets while learning about planetary science and habitability. Act as a cosmic architect to build worlds and discover if they can support life!

![Three.js](https://img.shields.io/badge/Three.js-v0.168.0-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

**🚀 [Try the Live Demo](https://ubaydamajit.github.io/planet-simulation/)**

## ✨ Features

### 🎮 Interactive Planet Building
- **8-step creation process** covering all aspects of planetary design
- Real-time 3D visualization of your planet as you make choices
- Dynamic texture loading based on planet type (Rocky, Icy, Ocean, Gas Giant, Custom)
- Atmospheric effects and lighting that respond to your selections

### 🔬 Educational Science Content
- Learn about **planetary habitability** through hands-on experience
- Scientific facts for each choice explaining real-world implications
- Factors include: surface type, size, star distance, atmosphere, water coverage, volcanism, magnetic fields, and star type

### 🧮 Life Possibility Algorithm
- Sophisticated scoring system based on astrobiological principles
- Calculates habitability percentage based on your planet's characteristics
- Determines potential life forms: from extremophiles to complex life

### 🎨 Immersive Experience
- Cinematic space-themed interface with background video
- Modern cosmic typography and smooth animations
- Three-stage user journey: Start → Build → Results
- Name your final creation and explore multiple scenarios

## 🚀 Quick Start

### Prerequisites
- Modern web browser with WebGL support
- Node.js (for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ubaydamajit/planet-simulation.git
   cd planet-simulation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)
   - Start creating your cosmic worlds!

### Alternative: Direct Browser Usage
Simply open `index.html` in a modern web browser - no build process required!

## 🎯 How to Use

1. **Start Your Journey**: Click "Start Simulation" to begin
2. **Design Your Planet**: Answer 8 questions about your planet's characteristics
3. **Watch It Form**: See your 3D planet update in real-time as you make choices
4. **Discover Life Potential**: Get your habitability score and possible life forms
5. **Name Your World**: Give your creation a unique name
6. **Start Again**: Create unlimited planets with different parameters

## 🛠️ Technical Details

### Built With
- **Three.js** - 3D graphics and WebGL rendering
- **Vanilla JavaScript** - ES6+ modules for clean, modern code
- **HTML5 & CSS3** - Semantic markup and modern styling
- **Vite** - Fast development and build tooling

### Key Components
- **3D Planet Rendering**: Dynamic geometry with procedural textures
- **Real-time Updates**: Planet appearance changes based on user choices
- **Scientific Algorithm**: Habitability scoring based on astrobiological factors
- **Responsive Design**: Works on desktop and mobile devices

### File Structure
```
planet-simulation/
├── index.html          # Main HTML structure
├── planet.js           # Core simulation logic
├── style.css           # Styling and animations
├── textures/           # Planet surface textures
│   ├── rocky/
│   ├── icy/
│   ├── ocean/
│   ├── gas/
│   └── custom/
├── background.mp4      # Space background video
└── package.json        # Dependencies and scripts
```

## 🎓 Educational Value

This simulator teaches concepts from:
- **Astrobiology**: What makes planets habitable?
- **Planetary Science**: How do size, atmosphere, and distance affect worlds?
- **Astronomy**: Different star types and their effects on planets
- **Geology**: Volcanic activity and magnetic fields
- **Physics**: Orbital mechanics and atmospheric retention

## 🌟 Screenshots

![Planet Simulation Screenshot](image.png)
![IN PLAY](image.png)
![Result](image.png)

Please feel free to open issues or submit pull requests.

## 📚 References & Credits

### Core Libraries
- **[Three.js](https://threejs.org/)** - JavaScript 3D Library
  - Version: 0.168.0
  - License: MIT License
  - Copyright: 2010-2024 Three.js Authors
  - Used for: 3D planet rendering, WebGL graphics, and real-time visualization

### External Resources
- **[Google Fonts](https://fonts.google.com/)**
  - **Orbitron** - Used for main headings and cosmic typography
  - **Raleway** - Used for body text and UI elements
  - License: Open Font License

### Development Tools
- **[Vite](https://vitejs.dev/)** - Fast build tool and development server
- **[npm](https://www.npmjs.com/)** - Package management

### Educational Content
- Planetary science concepts and habitability factors based on current astrobiological research
- Life possibility scoring algorithm inspired by real-world exoplanet habitability studies

---