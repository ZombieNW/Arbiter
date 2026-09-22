import { Chess } from '/vendor/chess/chess.js';

const game = new Chess();
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
