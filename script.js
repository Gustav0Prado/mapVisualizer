/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("gameCanvas");
if (canvas) {
   const ctx = canvas.getContext("2d");

   const SCREEN_SIZE = canvas.width;
   const GRID_SIZE   = 8;
   const LINE_SIZE   = SCREEN_SIZE/GRID_SIZE;  

   let player_lin = 5;
   let player_col = 4;
   let dir = 1;

   let map = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
   ]

   // Sprites da primeira layer
   let img_Center1 = new Image();
   let img_Left1 = new Image();
   let img_Right1 = new Image();
   img_Center1.src = './Center1.png';
   img_Left1.src = './Left1.png';
   img_Right1.src = './Right1.png';

   // Sprites da segunda layer
   let img_Center2 = new Image();
   let img_Left2 = new Image();
   let img_Right2 = new Image();
   img_Center2.src = './Center2.png';
   img_Left2.src = './Left2.png';
   img_Right2.src = './Right2.png';


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
         ctx.drawImage(img_Center1, SCREEN_SIZE/4, SCREEN_SIZE/4, 256, 256);
         done = true;
      }
      if(map[player_lin][player_col-dir] == 0) {
         ctx.drawImage(img_Center1, SCREEN_SIZE/4-256, SCREEN_SIZE/4, 256, 256);
      }
      if(map[player_lin][player_col+dir] == 0) {
         ctx.drawImage(img_Center1, SCREEN_SIZE/4+256, SCREEN_SIZE/4, 256, 256);
      }

      // Parede esquerda
      if(map[player_lin][player_col-dir] == 1) {
         ctx.drawImage(img_Left1, 0, 0, 128, 512);
      }
      // Parede direita
      if(map[player_lin][player_col+dir] == 1) {
         ctx.drawImage(img_Right1, 3*SCREEN_SIZE/4, 0, 128, 512);
      }

      return done;
   }

   function drawSecondLayer(player_lin, player_col, dir) {
      let done = false;

      // Checa segunda layer por paredes
      if(map[player_lin-(2*dir)][player_col] == 1) {
         ctx.drawImage(img_Center2, 3*SCREEN_SIZE/8, 3*SCREEN_SIZE/8, 128, 128);
         done = true;
      }
      if(map[player_lin-dir][player_col-dir] == 0) {
         ctx.drawImage(img_Center2, 3*SCREEN_SIZE/8-64, 3*SCREEN_SIZE/8, 64, 128);
      }
      if(map[player_lin-dir][player_col+dir] == 0) {
         ctx.drawImage(img_Center2, 7*SCREEN_SIZE/16+64, 3*SCREEN_SIZE/8, 96, 128);
      }

      // Parede esquerda
      if(map[player_lin-dir][player_col-dir] == 1) {
         ctx.drawImage(img_Left2, SCREEN_SIZE/4, SCREEN_SIZE/4, 64, 256);
      }
      // Parede direita
      if(map[player_lin-dir][player_col+dir] == 1) {
         ctx.drawImage(img_Right2, 5*SCREEN_SIZE/8, SCREEN_SIZE/4, 64, 256);
      }

      return done;
   }

   function drawThirdLayer(player_lin, player_col, dir) {
      // Checa terceira layer por paredes
      if(map[player_lin-(3*dir)][player_col] == 1) {
         ctx.drawImage(img_Center1, 7*SCREEN_SIZE/16, 7*SCREEN_SIZE/16, 64, 64);
      }
      if(map[player_lin-(2*dir)][player_col-dir] == 0) {
         ctx.drawImage(img_Center1, 7*SCREEN_SIZE/16-32, 7*SCREEN_SIZE/16, 32, 64);
      }
      if(map[player_lin-(2*dir)][player_col+dir] == 0) {
         ctx.drawImage(img_Center1, 7*SCREEN_SIZE/16+64, 7*SCREEN_SIZE/16, 32, 64);
      }

      // Parede esquerda
      if(map[player_lin-(2*dir)][player_col-dir] == 1) {
         ctx.drawImage(img_Left1, 3*SCREEN_SIZE/8, 3*SCREEN_SIZE/8, 32, 128);
      }
      // Parede direita
      if(map[player_lin-(2*dir)][player_col+dir] == 1) {
         ctx.drawImage(img_Right1, 9*SCREEN_SIZE/16, 3*SCREEN_SIZE/8, 32, 128);
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