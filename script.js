/** @type {HTMLCanvasElement} */
const canvas1 = document.getElementById("c1");
const canvas2 = document.getElementById("c2");
const canvas3 = document.getElementById("c3");
const canvas4 = document.getElementById("c4");

const canvas = [canvas1, canvas2, canvas3, canvas4];

if (canvas1 && canvas2 && canvas3) {
   const ctxs = [canvas1.getContext("2d"), canvas2.getContext("2d"), canvas3.getContext("2d"), canvas4.getContext("2d")]
   const ctx = ctxs[0];

   const MAP_SIZE = 8;

   // Minimapa definitions
   const MMAP_TILE_SIZE = 8;
   const MMAP_TILE_DIST = MMAP_TILE_SIZE + 1;
   const MMAP_OFFSET = 10;

   // Draw Distance of the player
   const D_DISTANCE = 3;

   const DRAW_WALL_GUIDES = false;

   // Player initial position
   let player_lin = 4;
   let player_col = 4;

   let map = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 1],
      [1, 0, 1, 0, 0, 1, 1, 1],
      [1, 0, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
   ]

   /**
    * Rotates the whole map to the left in order to turn
    * !!!! OLD !!!! NEEDS TO BE REDONE
    */
   function rotateLeft() {
      map = map[0].map((val, index) => map.map(row => row[index]).reverse());
      aux = player_col;
      player_col = 7-player_lin;
      player_lin = aux;
   }

   /**
    * Rotates the whole map to the right in order to turn
    * !!!! OLD !!!! NEEDS TO BE REDONE
    */
   function rotateRight() {
      map = map[0].map((val, index) => map.map(row => row[row.length-1-index]));
      aux = player_col;
      player_col = player_lin;
      player_lin = 7-aux;
   }

   /**
    * Just draws the minimap
    */
   function drawMiniMap() {
      // Minimap has a red outline
      ctx.strokeStyle = "red";
      ctx.strokeRect(MMAP_OFFSET, MMAP_OFFSET, MMAP_TILE_DIST*MMAP_TILE_SIZE, MMAP_TILE_DIST*MMAP_TILE_SIZE);

      ctx.lineWidth = 1;
      for(let i = 0; i < MAP_SIZE; ++i) {
         for(let j = 0; j < MAP_SIZE; ++j) {
            // Minimap tiles have size = MMAP_TILE_SIZE and spacing between one another = MMAP_TILE_DIST
            // Plus MMAP_OFFSET of offset to get off the corner a little bit
            let x = j*MMAP_TILE_DIST+MMAP_OFFSET;
            let y = i*MMAP_TILE_DIST+MMAP_OFFSET;
            
            // Walls are white
            if(map[i][j]) {
               ctx.fillStyle = "white";
               ctx.fillRect(x, y, MMAP_TILE_SIZE, MMAP_TILE_SIZE);
            }
            else if(i == player_lin && j == player_col) {
               ctx.fillStyle = "red";
               ctx.fillRect(x, y, MMAP_TILE_SIZE, MMAP_TILE_SIZE);
            }
            else{
               ctx.fillStyle = "black";
               ctx.fillRect(x, y, MMAP_TILE_DIST, MMAP_TILE_DIST);
            }
         }
      }
   }

   /**
    * 
    * @param {*} ctx Context where last wall will be drawn
    * @param {*} canvas Canvas where last wall will be drawn
    */
   function drawLastWall (ctx, canvas, darkWall) {
      
      /**
       * If the last wall is beyond the Draw Distance
       * we still draw it, but with low opacity
       */
      if (darkWall) ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
      else ctx.strokeStyle = "red";

      ctx.beginPath();
      // Ceiling line
      ctx.moveTo(0,0);
      ctx.lineTo(canvas.width, 0);
      
      // Ground line
      ctx.moveTo(0,canvas.height);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.stroke();
   }

   /**
    * Draws walls that are "turns", so are facing the player
    * indicating an open passage to that direction
    * @param {*} ctx Context to draw
    * @param {int} i n of the context
    * @param {string} side which side
    */
   function drawTurnWalls (ctx, i, side, NEXT_IS_TURN) {
      ctx.lineWidth = 1;
      
      let cw = canvas[i].width;
      let ch = canvas[i].height;
      let dx = (cw-canvas[i+1].width)/2;
      let dy = (ch-canvas[i+1].height)/2;

      // Walls that turn and are right in front of you
      // warp intead of being plane, indicating a turn next to it
      if (NEXT_IS_TURN) {
         if (side == "left") {
            ctx.beginPath();
            ctx.moveTo(0, 2*dy);
            ctx.lineTo(dx, dy);
            
            ctx.lineTo(dx, ch-dy);

            ctx.lineTo(0, ch-2*dy);
            ctx.stroke();
         }
         else if (side == "right"){
            // Right
            ctx.beginPath();
            ctx.moveTo(cw, 2*dy);
            ctx.lineTo(cw-dx, dy);
            
            ctx.lineTo(cw-dx, ch-dy);

            ctx.lineTo(cw, ch-2*dy);
            ctx.stroke();
         }
      }
      else {
         if (side == "left") {
            ctx.beginPath();
            ctx.moveTo(0, dy);
            ctx.lineTo(dx, dy);
            
            if (DRAW_WALL_GUIDES) ctx.lineTo(dx, ch-dy);
            else ctx.moveTo(dx, ch-dy);

            ctx.lineTo(0, ch-dy);
            ctx.stroke();
         }
         else if (side == "right"){
            // Right
            ctx.beginPath();
            ctx.moveTo(cw, dy);
            ctx.lineTo(cw-dx, dy);
            
            if (DRAW_WALL_GUIDES) ctx.lineTo(cw-dx, ch-dy);
            else ctx.moveTo(cw-dx, ch-dy);

            ctx.lineTo(cw, ch-dy);
            ctx.stroke();
         }
      }
   }

   /**
    * Function to draw walls on the side of the player
    * @param {*} ctx Context to draw
    * @param {int} i n of the canvas
    * @param {string} side Which side to draw
    */
   function drawSideWalls(ctx, i, side, NEXT_IS_TURN) {
      ctx.strokeStyle = "red"

      let cw = canvas[i].width;
      let ch = canvas[i].height;
      let dx = (cw-canvas[i+1].width)/2;
      let dy = (ch-canvas[i+1].height)/2;

      if (side == "left") {
         ctx.beginPath();
         ctx.moveTo(0, 0);
         ctx.lineTo(dx, dy);
         
         if (DRAW_WALL_GUIDES || NEXT_IS_TURN) ctx.lineTo(dx, ch-dy);
         else ctx.moveTo(dx, ch-dy)
         
         ctx.lineTo(0, ch);
         ctx.stroke();
      }
      else if (side == "right"){
         // Right
         ctx.beginPath();
         ctx.moveTo(cw, 0);
         ctx.lineTo(cw-dx, dy);
         
         if (DRAW_WALL_GUIDES || NEXT_IS_TURN) ctx.lineTo(cw-dx, ch-dy);
         else ctx.moveTo(cw-dx, ch-dy);
         
         ctx.lineTo(cw, ch);
         ctx.stroke();
      }
   }

   /**
    * Function to draw the map in pseudo-3D using lines
    * to emulate old wireframe games :D
    */
   function draw3DMap() {
      let i;
      let drawing = true;
      
      // Checks all positions until the Draw Distance
      for (i = 0; i < D_DISTANCE && drawing; ++i){
         let ctx = ctxs[i];
         if (map[player_lin-i][player_col-1] == 1) {
            drawSideWalls(ctx, i, "left", (map[player_lin-i-1][player_col-1] == 0));
         }
         else {
            drawTurnWalls(ctx, i, "left", (map[player_lin-i-1][player_col-1] == 0));
         }

         if (map[player_lin-i][player_col+1] == 1) {
            drawSideWalls(ctx, i, "right", (map[player_lin-i-1][player_col+1] == 0));
         }
         else {
            drawTurnWalls(ctx, i, "right", (map[player_lin-i-1][player_col+1] == 0));
         }

         // If it finds a wall facing the player it stops,
         // since you cant see anything past it
         if (map[player_lin-i-1][player_col] == 1) {
            drawing = false;
         }
      }

      drawLastWall(ctxs[i], canvas[i], (map[player_lin-i][player_col] != 1));
   }

   /**
    * Clears all the canvas before redrawing on every frame
    */
   function clearAllCanvas() {
      for (let i = 0; i < canvas.length; ++i) {
         ctxs[i].clearRect(0, 0, canvas[i].width, canvas[i].height);
      }
   }

   /**
    * Main game function
    */
   function gameLoop() {
      clearAllCanvas();
      draw3DMap();
      drawMiniMap();
   }

   /**
    * Listens the keyboard for input
    */
   document.addEventListener("keydown",
      function(event) {
         switch (event.key) {
         case 'w': if(map[player_lin-1][player_col] == 0){ player_lin--; } break;
         case 's': rotateLeft(); rotateLeft(); break;
         case 'a': rotateLeft();  break;
         case 'd': rotateRight(); break;

         default: break;
         }
      },
   );

   // Runs the game!!! 30 FPS i think ???
   setInterval(gameLoop, 1000 / 30);
}