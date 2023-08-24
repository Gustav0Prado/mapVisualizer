/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("gameCanvas");
if (canvas) {
   const ctx = canvas.getContext("2d");

   const SCREEN_SIZE = canvas.width;
   const GRID_SIZE   = 8;
   const LINE_SIZE   = SCREEN_SIZE/GRID_SIZE;  

   let player_lin = 4;
   let player_col = 4;
   let dir = 1;

   let map = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
   ]

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

   function drawFrontWalls(sizeX, sizeY) {
      // Desenha parte de cima parede
      ctx.strokeRect((SCREEN_SIZE-sizeX)/2, (SCREEN_SIZE-sizeY)/2, sizeX, sizeY);
      ctx.stroke();
   }

   function drawSideWalls(startX, startY, endX, endY) {
      // Desenha parte de cima parede
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Desenha parte de baixo parede
      ctx.beginPath();
      ctx.moveTo(startX, SCREEN_SIZE-startY);
      ctx.lineTo(endX, SCREEN_SIZE-endY);
      ctx.stroke();

      // Desenha divisao da parede
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX, SCREEN_SIZE-endY);
      ctx.stroke();
   }

   function drawFirstLayer(player_lin, player_col, dir) {
      let done = false;

      // Checa primeira layer por paredes
      if(map[player_lin-dir][player_col] == 1) {
         ctx.strokeRect(SCREEN_SIZE/4, SCREEN_SIZE/4, SCREEN_SIZE/2, SCREEN_SIZE/2);
         done = true;
      }
      if(map[player_lin][player_col-dir] == 0) {
         ctx.strokeRect(SCREEN_SIZE/4-256, SCREEN_SIZE/4, SCREEN_SIZE/2, SCREEN_SIZE/2);
      }
      if(map[player_lin][player_col+dir] == 0) {
         ctx.strokeRect(SCREEN_SIZE/4+256, SCREEN_SIZE/4, SCREEN_SIZE/2, SCREEN_SIZE/2);
      }

      // Parede esquerda
      if(map[player_lin][player_col-dir] == 1) {
         drawSideWalls(0, 0, SCREEN_SIZE/4, SCREEN_SIZE/4);
      }
      // Parede direita
      if(map[player_lin][player_col+dir] == 1) {
         drawSideWalls(SCREEN_SIZE, 0, 3*SCREEN_SIZE/4, SCREEN_SIZE/4);
      }

      return done;
   }

   function drawSecondLayer(player_lin, player_col, dir) {
      let done = false;

      // Checa primeira layer por paredes
      if(map[player_lin-(2*dir)][player_col] == 1) {
         ctx.strokeRect(3*SCREEN_SIZE/8, 3*SCREEN_SIZE/8, SCREEN_SIZE/4, SCREEN_SIZE/4);
         done = true;
      }
      if(map[player_lin-dir][player_col-dir] == 0) {
         ctx.strokeRect(3*SCREEN_SIZE/8-64, 3*SCREEN_SIZE/8, SCREEN_SIZE/8, SCREEN_SIZE/4);
      }
      if(map[player_lin-dir][player_col+dir] == 0) {
         ctx.strokeRect(3*SCREEN_SIZE/8+192, 3*SCREEN_SIZE/8, SCREEN_SIZE/8, SCREEN_SIZE/4);
      }

      // Parede esquerda
      if(map[player_lin-dir][player_col-dir] == 1) {
         ctx.beginPath();
         ctx.moveTo(SCREEN_SIZE/4, SCREEN_SIZE/4);
         ctx.lineTo(3*SCREEN_SIZE/8, 3*SCREEN_SIZE/8);

         ctx.moveTo(SCREEN_SIZE/4, 3*SCREEN_SIZE/4);
         ctx.lineTo(3*SCREEN_SIZE/8, 5*SCREEN_SIZE/8);

         ctx.moveTo(3*SCREEN_SIZE/8, 3*SCREEN_SIZE/8);
         ctx.lineTo(3*SCREEN_SIZE/8, 5*SCREEN_SIZE/8);

         ctx.stroke();
      }
      // Parede direita
      if(map[player_lin-dir][player_col+dir] == 1) {
         ctx.beginPath();
         ctx.moveTo(3*SCREEN_SIZE/4, SCREEN_SIZE/4);
         ctx.lineTo(5*SCREEN_SIZE/8, 3*SCREEN_SIZE/8);

         ctx.moveTo(3*SCREEN_SIZE/4, 3*SCREEN_SIZE/4);
         ctx.lineTo(5*SCREEN_SIZE/8, 5*SCREEN_SIZE/8);

         ctx.moveTo(5*SCREEN_SIZE/8, 3*SCREEN_SIZE/8);
         ctx.lineTo(5*SCREEN_SIZE/8, 5*SCREEN_SIZE/8);

         ctx.stroke();
      }

      return done;
   }

   function drawThirdLayer(player_lin, player_col, dir) {
      // Checa primeira layer por paredes
      if(map[player_lin-(3*dir)][player_col] == 1) {
         ctx.strokeRect(7*SCREEN_SIZE/16, 7*SCREEN_SIZE/16, SCREEN_SIZE/8, SCREEN_SIZE/8);
         done = true;
      }
      if(map[player_lin-(2*dir)][player_col-dir] == 0) {
         ctx.strokeRect(7*SCREEN_SIZE/16-64, 7*SCREEN_SIZE/16, SCREEN_SIZE/8, SCREEN_SIZE/8);
      }
      if(map[player_lin-(2*dir)][player_col+dir] == 0) {
         ctx.strokeRect(7*SCREEN_SIZE/16+64, 7*SCREEN_SIZE/16, SCREEN_SIZE/8, SCREEN_SIZE/8);
      }

      // Parede esquerda
      if(map[player_lin-(3*dir)][player_col-dir] == 1) {
         ctx.beginPath();
         ctx.moveTo(3*SCREEN_SIZE/8, 3*SCREEN_SIZE/8);
         ctx.lineTo(7*SCREEN_SIZE/16, 7*SCREEN_SIZE/16);

         ctx.moveTo(3*SCREEN_SIZE/8, 5*SCREEN_SIZE/8);
         ctx.lineTo(7*SCREEN_SIZE/16, 9*SCREEN_SIZE/16);

         ctx.stroke();
      }
      // Parede direita
      if(map[player_lin-(3*dir)][player_col+dir] == 1) {
         ctx.beginPath();
         ctx.moveTo(5*SCREEN_SIZE/8, 3*SCREEN_SIZE/8);
         ctx.lineTo(9*SCREEN_SIZE/16, 7*SCREEN_SIZE/16);

         ctx.moveTo(5*SCREEN_SIZE/8, 5*SCREEN_SIZE/8);
         ctx.lineTo(9*SCREEN_SIZE/16, 9*SCREEN_SIZE/16);

         ctx.stroke();
      }
   }

   function draw3DMap() {
      let doneFront = false;

      ctx.strokeStyle = "#3cff00"

      doneFront = drawFirstLayer (player_lin, player_col, dir);
      if (!doneFront) {
         doneFront = drawSecondLayer(player_lin, player_col, dir);
      }
      if (!doneFront){
         drawThirdLayer (player_lin, player_col, dir);
      } 
   }

   function drawMiniMap() {
      map.forEach((e, i) => {
         let x = LINE_SIZE * (i % GRID_SIZE);
         let y = LINE_SIZE * Math.floor(i / GRID_SIZE);
         
         // Se tile estiver ocupada, desenha branca
         if(e) {
            // Desenha minimapa
            ctx.fillStyle = "white";
            ctx.fillRect(x, y, LINE_SIZE, LINE_SIZE);
         }
         
         // Desenha grid no mapa
         ctx.strokeStyle = "black";
         ctx.beginPath();

         // Desenha linhas verticais
         ctx.moveTo(x, y);
         ctx.lineTo(x, y+LINE_SIZE);

         // Desenha linhas horizontais
         ctx.moveTo(x, y);
         ctx.lineTo(x+LINE_SIZE, y);

         ctx.stroke();
      });
   }

   function gameLoop() {
      // Desenha fundo
      ctx.rect(0, 0, SCREEN_SIZE, SCREEN_SIZE)
      ctx.fillStyle = "black";
      ctx.fill();

      //drawMiniMap();
      draw3DMap();
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