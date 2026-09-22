import { Chess } from '/vendor/chess/chess.js';

const game = new Chess();
const stockfish = new Worker('vendor/stockfish/stockfish-19-lite-single.js');
let board = null;

function onDragStart (source, piece, position, orientation) {
  if (game.isGameOver()) return false;

  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
}

function onDrop (source, target) {
  try {
    const move = game.move({
      from: source,
      to: target,
      promotion: 'q'
    });

    board.position(game.fen());

    if (!game.isGameOver()) {
      stockfish.postMessage('position fen ' + game.fen());
      stockfish.postMessage('go depth 10');
    }

  } catch (error) {
    return 'snapback';
  }
}

function onSnapEnd () {
  board.position(game.fen());
}

const config = {
  draggable: true,
  position: 'start',
  pieceTheme: '/img/chesspieces/wikipedia/{piece}.png',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};

board = Chessboard('myBoard', config);

stockfish.onmessage = function(event) {
  const message = event.data;
  if (message.startsWith('bestmove')) {
    const moveString = message.split(' ')[1];
    if (moveString) {
      const source = moveString.slice(0, 2);
      const target = moveString.slice(2, 4);
      const promotion = moveString.slice(4, 5) || 'q';

      game.move({ from: source, to: target, promotion: promotion });
      board.position(game.fen());
    }
  }
};
