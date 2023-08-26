/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("gameCanvas");
if (canvas) {
   const ctx = canvas.getContext("2d");

   const SCREEN_SIZE = canvas.width;
   const GRID_SIZE   = 8;
   const LINE_SIZE   = SCREEN_SIZE/GRID_SIZE;  

   let player_lin = 6;
   let player_col = 6;
   let dir = 1;

   let map = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
   ]

   // Sprites
   let spr_wall_center = new Image();
   let spr_wall_left   = new Image();
   let spr_wall_right  = new Image();
   let spr_ground      = new Image();
   let spr_ceiling     = new Image();

   // Load sprite sources
   spr_wall_center.src = './assets/sprites/wall_center.png';
   spr_wall_left.src   = './assets/sprites/wall_left.png';
   spr_wall_right.src  = './assets/sprites/wall_right.png';
   spr_ground.src      = './assets/sprites/ground.png';
   spr_ceiling.src     = './assets/sprites/ceiling.png';

   function rotateLeft() {
      map = map[0].map((val, index) => map.map(row => row[index]).reverse());
      aux = player_col;
      player_col = 7-player_lin;
      player_lin = aux;
   }

   function rotateRight() {
      map = map[0].map((val, index) => map.map(row => row[row.length-1-index]));
      aux = player_col;
      player_col = player_lin;
      player_lin = 7-aux;
   }

   function darkenLayer(posX, posY, sizeX, sizeY, qtd) {
      const imageData = ctx.getImageData(posX, posY, sizeX, sizeY);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
         data[i] -= qtd*20; // red
         data[i + 1] -= qtd*20; // green
         data[i + 2] -= qtd*20; // blue
      }
      ctx.putImageData(imageData, posX, posY);
   }

   function draw3DMap() {
      let done = false;

      for(let layer = 0; layer < 8 && !done; ++layer) {
         // Pontos de guia
         let offSet = SCREEN_SIZE/(2**layer);
         let size = {
            full:   offSet,
            half:   offSet/2,
            quart:  offSet/4,
            double: 2*offSet,
         }
         let topLeft = {
            x: SCREEN_SIZE/2-(offSet/2), 
            y: SCREEN_SIZE/2-(offSet/2),
         };
         let topRight = {
            x: SCREEN_SIZE/2+(offSet/2), 
            y: SCREEN_SIZE/2-(offSet/2),
         };
         let bottomLeft = {
            x: SCREEN_SIZE/2-(offSet/2), 
            y: SCREEN_SIZE/2+(offSet/2),
         };

         // Check for frontal walls
         if(map[player_lin-(layer*dir)][player_col] == 1) {
            ctx.drawImage(spr_wall_center, topLeft.x, topLeft.y, size.full, size.full);
            done = true;
         }

         // Background frontal walls
         if(map[player_lin-(layer*dir-1)][player_col-dir] == 0) { //left
            ctx.drawImage(spr_wall_center, topLeft.x-size.half, topLeft.y, size.half, size.full);
         }
         if(map[player_lin-(layer*dir-1)][player_col+dir] == 0) { //right
            ctx.drawImage(spr_wall_center, topLeft.x+size.full, topLeft.y, size.half, size.full);
         }

         // Left Wall
         if(map[player_lin-(layer*dir-1)][player_col-dir] == 1) {
            ctx.drawImage(spr_wall_left, topLeft.x-size.half, topLeft.y-size.half, size.half, size.double);
         }
         // Right Wall
         if(map[player_lin-(layer*dir-1)][player_col+dir] == 1) {
            ctx.drawImage(spr_wall_right, topRight.x, topRight.y-size.half, size.half, size.double);
         }

         // Draw ceiling and ground
         ctx.drawImage(spr_ground, bottomLeft.x-size.half, bottomLeft.y, size.double, size.half);
         ctx.drawImage(spr_ceiling, topLeft.x-size.half, topLeft.y-size.half, size.double, size.half);
      
         debugger;
         darkenLayer(topLeft.x-size.half, topLeft.y-size.half, size.double, size.double, layer);
      }
   }

   function drawMiniMap() {
      for(let i = 0; i < 8; ++i) {
         for(let j = 0; j < 8; ++j) {
            // Minimap is 32*32
            let x = SCREEN_SIZE-32+(4*j);
            let y = SCREEN_SIZE-32+(4*i);
            
            // Walls are white
            if(map[i][j]) {
               ctx.fillStyle = "white";
               ctx.fillRect(x, y, 4, 4);
            }
            else if(i == player_lin && j == player_col) {
               ctx.fillStyle = "red";
               ctx.fillRect(x, y, 4, 4);
            }
         }
      }
   }

   function gameLoop() {
      // Draw background
      ctx.rect(0, 0, SCREEN_SIZE, SCREEN_SIZE)
      ctx.fillStyle = "black";
      ctx.fill();

      draw3DMap();
      drawMiniMap();
   }

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

   setInterval(gameLoop, 1000 / 30);
}