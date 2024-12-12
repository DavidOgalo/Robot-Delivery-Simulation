// Animation script for a robot delivering parcels in a virtual village
// Ensures smooth transitions, UI updates, and interaction control

(function() {

  "use strict"

  let active = null; // Tracks the currently active animation

  // Coordinates for each place in the village
  const places = {
    "Alice's House": {x: 279, y: 100},
    "Bob's House": {x: 295, y: 203},
    "Cabin": {x: 372, y: 67},
    "Daria's House": {x: 183, y: 285},
    "Ernie's House": {x: 50, y: 283},
    "Farm": {x: 36, y: 118},
    "Grete's House": {x: 35, y: 187},
    "Marketplace": {x: 162, y: 110},
    "Post Office": {x: 205, y: 57},
    "Shop": {x: 137, y: 212},
    "Town Hall": {x: 202, y: 213}
  };
  const placeKeys = Object.keys(places);

  const speed = 2; // Speed of the animation

  // Class that manages the animation of the robot and parcels
  class Animation {
      constructor(worldState, robot, robotState) {
          this.worldState = worldState; // Current state of the virtual world
          this.robot = robot; // Robot function controlling its behavior
          this.robotState = robotState; // Robot's memory state
          this.turn = 0; // Turn counter

          // Create the container for the animation
          let outer = (window.__sandbox ? window.__sandbox.output.div : document.body);
          let doc = outer.ownerDocument;
          this.node = outer.appendChild(doc.createElement("div"));
          this.node.style.cssText = "position: relative; line-height: 0.1; margin-left: 10px";

          // Add the map image
          this.map = this.node.appendChild(doc.createElement("img"));
          this.map.src = "./images/village2x.png"; // Updated path
          this.map.style.cssText = "vertical-align: -8px";

          // Add the robot element
          this.robotElt = this.node.appendChild(doc.createElement("div"));
          this.robotElt.style.cssText = `
              position: absolute; 
              width: 60px;
              height: 60px;
              transition: left ${0.8 / speed}s, top ${0.8 / speed}s;
          `;
          let robotPic = this.robotElt.appendChild(doc.createElement("img"));
          robotPic.src = "./images/robot_moving2x.gif"; // Updated path
          robotPic.style.cssText = `
              width: 100%; 
              height: 100%; 
              object-fit: contain;
          `;

          // List to hold parcel elements
          this.parcels = [];

          // Add UI elements for status and control
          this.text = this.node.appendChild(doc.createElement("span"));
          this.button = this.node.appendChild(doc.createElement("button"));
          this.button.style.cssText = "color: white; background: #28b; border: none; border-radius: 2px; padding: 2px 5px; line-height: 1.1; font-family: sans-serif; font-size: 80%";
          this.button.textContent = "Stop";

          // Add event listener to the button
          this.button.addEventListener("click", () => this.clicked());

          // Schedule the first tick and initialize the view
          this.schedule();
          this.updateView();
          this.updateParcels();

          // Update parcels when the robot transitions
          this.robotElt.addEventListener("transitionend", () => this.updateParcels());
      }

      // Updates the robot's position on the map
      updateView() {
          let pos = places[this.worldState.place];
          this.robotElt.style.top = (pos.y - 38) + "px";
          this.robotElt.style.left = (pos.x - 16) + "px";

          this.text.textContent = ` Turn ${this.turn} `;
      }

      // Method to initialize and update the parcel distribution table
    updateTable() {
        const tableBody = document.querySelector("#status-table tbody");
        tableBody.innerHTML = ""; // Clear previous entries

        const parcelCounts = {};
        for (let key of Object.keys(places)) {
            parcelCounts[key] = 0; // Initialize count
        }

        for (let parcel of this.worldState.parcels) {
            parcelCounts[parcel.place]++;
        }

        for (let [place, count] of Object.entries(parcelCounts)) {
            const row = document.createElement("tr");
        
            const locationCell = document.createElement("td");
            locationCell.textContent = `${place}`;
        
            const parcelsCell = document.createElement("td");
            parcelsCell.textContent = count > 0 ? `${count} 📦` : "No parcels"; 
        
            const robotCell = document.createElement("td");
            robotCell.textContent = place === this.worldState.place ? "🤖 Robot Here" : ""; 
        
            row.appendChild(locationCell);
            row.appendChild(parcelsCell);
            row.appendChild(robotCell);
        
            tableBody.appendChild(row);
        }
        
    }

      
      // Updates the position of parcels on the map and calls 'updateTable' whenever parcels are updated
    updateParcels() {
        while (this.parcels.length) this.parcels.pop().remove(); // Clear old parcels
        let heights = {}; // Track stack heights for parcels at each place
    
        for (let { place, address } of this.worldState.parcels) {
            let height = heights[place] || (heights[place] = 0);
            heights[place] += 14;
    
            let node = document.createElement("div");
            let offset = placeKeys.indexOf(address) * 16;
            node.style.cssText = `
                position: absolute;
                height: 20px;
                width: 20px;
                background-image: url(./images/parcel2x.png);
                background-position: 0 -${offset}px;
            `;
    
            if (place == this.worldState.place) {
                node.style.left = "25px";
                node.style.bottom = (20 + height) + "px";
                this.robotElt?.appendChild(node);
            } else {
                let pos = places[place];
                if (pos) {
                    node.style.left = (pos.x - 5) + "px";
                    node.style.top = (pos.y - 10 - height) + "px";
                    this.node?.appendChild(node);
                } else {
                    console.error(`Unknown place: ${place}`);
                }
            }
            this.parcels.push(node);
        }
    
        this.updateTable(); // Update the table with the latest state
    }
    
      // Simulates a single turn of the animation and calls 'updateTable'
    tick() {
        console.log(`Turn: ${this.turn}, Parcels: ${this.worldState.parcels.length}`);
        let { direction, memory } = this.robot(this.worldState, this.robotState);
        this.worldState = this.worldState.move(direction);
        this.robotState = memory;
        this.turn++;

        this.updateView();
        this.updateTable();

        // Update the "Move Details" section
        const moveDetails = document.querySelector("#move-details");
        moveDetails.innerHTML = `<h2>Move Details</h2>
                                <p>Turn: ${this.turn}</p>
                                <p>Robot Location: ${this.worldState.place}</p>
                                <p>Remaining Parcels: ${this.worldState.parcels.length}</p>`;

        if (this.worldState.parcels.length == 0) {
            this.button.remove();
            this.text.textContent = ` Finished after ${this.turn} turns`;
            this.robotElt.firstChild.src = "./images/robot_idle2x.gif";
        } else {
            this.schedule();
        }
    }


      // Schedules the next tick of the animation
      schedule() {
          this.timeout = setTimeout(() => this.tick(), 1000 / speed);
      }

      // Handles the button click to start/stop the animation
      clicked() {
          if (this.timeout == null) {
              this.schedule();
              this.button.textContent = "Stop";
              this.robotElt.firstChild.src = "./images/robot_moving2x.gif"; 
          } else {
              clearTimeout(this.timeout);
              this.timeout = null;
              this.button.textContent = "Start";
              this.robotElt.firstChild.src = "./images/robot_idle2x.gif";
          }
      }
  }

  // Runs the robot animation
  window.runRobotAnimation = function(worldState, robot, robotState) {
      if (active && active.timeout != null)
          clearTimeout(active.timeout);
      active = new Animation(worldState, robot, robotState);
  }

})();
