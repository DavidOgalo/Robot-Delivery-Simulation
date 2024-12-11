# Robot Delivery Simulation

## Overview

This project simulates a robot delivering parcels across a fictional village. The simulation is built using JavaScript and runs in a browser. It demonstrates concepts of graph traversal, state management, and performance evaluation of various pathfinding and task-solving algorithms.

The project includes:
1. A simulation of a robot delivering parcels.
2. Multiple robot algorithms to explore different strategies.
3. A visual animation of the robot's movements.
4. Performance tests to compare the efficiency of the algorithms.

---

## Features

- **Graph-Based Pathfinding:** The village is represented as a graph where nodes are locations, and edges are roads connecting them.
- **Multiple Algorithms:** Three robot strategies are implemented:
  1. **Random Robot:** Moves randomly to adjacent nodes.
  2. **Route Robot:** Follows a predefined route.
  3. **Goal-Oriented Robot:** Uses a task-focused approach to deliver parcels efficiently.
  4. **Lazy Robot:** Optimized to prioritize tasks based on route length and parcel pick-up.
- **Performance Comparison:** Includes tools to measure and compare the efficiency of the algorithms.
- **Persistent Data Structure (PGroup):** Implements a functional data structure to manage immutable collections.
- **Animation:** A visual representation of the robot's movements using an SVG map of the village.

---

## Modules

### `robot.js`
This is the core logic file for the simulation. Key components:
- **Graph Representation:** Roads are represented as a graph using adjacency lists.
- **Village State:** Encapsulates the robot's current location and the parcels to be delivered.
- **Robots:** Implements various strategies (`randomRobot`, `routeRobot`, `goalOrientedRobot`, and `lazyRobot`).
- **Performance Testing:** Functions (`countSteps` and `compareRobots`) for evaluating and comparing algorithm efficiency.

### `animate.js`
This module handles the visual animation of the robot's movement:
- Renders the robot and parcels on a pre-defined map.
- Updates the robot's position in real-time as it moves between locations.

### `index.html`
The entry point for running the simulation in a browser:
- Links `robot.js` and `animate.js`.
- Initializes the simulation with random parcels and the selected robot strategy.

---

## Exercises for Performance Evaluation

To measure the performance of the algorithms:
1. **Setup:** Call `compareRobots(robot1, memory1, robot2, memory2)` to evaluate two robots over 100 tasks.
2. **Metrics:** The output displays the average number of steps each robot takes to complete a task.
3. **Customization:** Modify the `parcelCount` in `VillageState.random(parcelCount)` to test with varying task complexities.

---

## Setup and Run Guide

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, etc.).
- No additional tools or libraries are required.

### Steps to Run
1. Clone or download the project files to your local machine.
2. Ensure the following files are present in the same directory:
   - `index.html`
   - `robot.js`
   - `animate.js`
   - `village2x.png` (Map image for animation, placed in an `img/` directory).
3. Open `index.html` in your browser.

### Running the Simulation
- By default, the simulation runs with `goalOrientedRobot` logic. To test other robots:
  1. Modify the `runRobotAnimation` function call in `index.html`.
  2. Replace `goalOrientedRobot` with `randomRobot`, `routeRobot`, or `lazyRobot`.

---

## Example Output
### Console Logs:
- **Simulation Result:** Displays the number of turns taken to deliver all parcels.
- **Robot Moves:** Logs each step the robot takes (e.g., "Moved to Alice's House").

### Performance Tests:
- Output example:
