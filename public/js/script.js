import { Chess } from '/vendor/chess/chess.js';

const stockfish1 = new Worker('vendor/stockfish/stockfish-19-lite-single.js');
const stockfish2 = new Worker('vendor/stockfish/stockfish-19-lite-single.js');

let game = new Chess();
let currentEngineIndex = 0;

const board = new Chessboard('myBoard', {
  draggable: false,
  position: 'start'
});

function handleBestMove(event) {
  const message = event.data;
  if (message.startsWith('bestmove')) {
    const moveString = message.split(' ')[1];
    if (moveString) {
      try {
        const from = moveString.slice(0, 2);
        const to = moveString.slice(2, 4);
        const promotion = moveString.slice(4, 5) || 'q';

        const move = game.move({ from, to, promotion });
        if (move) {
          board.position(game.fen());

          if (game.isGameOver()) {
            return;
          }

          currentEngineIndex = (currentEngineIndex + 1) % 2;
          const nextWorker = currentEngineIndex === 0 ? stockfish1 : stockfish2;

          nextWorker.postMessage(`position fen ${game.fen()}`);
          nextWorker.postMessage(`go depth 10`);
        }
      } catch (e) {
        console.error('Move error:', e);
      }
    }
  }
}

stockfish1.onmessage = handleBestMove;
stockfish2.onmessage = handleBestMove;


const stock1Difficulty = Math.ceil(Math.random() * 20);
const stock2Difficulty = Math.ceil(Math.random() * 20);

stockfish1.postMessage(`setoption name Skill Level value ${stock1Difficulty}`);
stockfish2.postMessage(`setoption name Skill Level value ${stock2Difficulty}`);

stockfish1.postMessage(`position fen ${game.fen()}`);
stockfish1.postMessage(`go depth 10`);
