# Cosmic Network

An interactive particle visualization built with p5.js that creates a dynamic network of connected particles with rainbow color effects.

## Features

- **Interactive Particle System**: Particles move with physics simulation and respond to mouse movement
- **Dynamic Connections**: Particles within range automatically connect with colorful lines
- **Mouse Controls**:
  - Move mouse to attract particles
  - Click to spawn new particles
  - Press Space to reset the visualization
- **Visual Effects**:
  - Rainbow color gradients
  - Glow effects on particles
  - Trailing motion blur
  - Pulsing particle sizes

## Demo

Open `index.html` in a web browser to run the visualization.

## Usage

### Running Locally

1. Clone this repository
2. Open `index.html` in a modern web browser
3. For best results, use a local server:
   ```bash
   # Python 3
   python -m http.server
   
   # Or use VS Code Live Server extension
   ```

### Controls

- **Mouse Movement**: Attracts particles towards cursor position
- **Mouse Click**: Spawns 5 new particles at cursor location
- **Space Key**: Resets all particles

## Configuration

Key parameters in `sketch.js`:
- `MAX_PARTICLES`: Maximum particle count (default: 150)
- `CONNECTION_DISTANCE`: Range for particle connections (default: 120px)
- Particle lifespan and spawn rate can be adjusted

## Technologies

- [p5.js](https://p5js.org/) v1.9.0
- HTML5 Canvas
- JavaScript ES6

## License

This project is open source and available under the MIT License.
