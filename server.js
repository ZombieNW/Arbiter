import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.use('/vendor/chessboard', express.static(path.join(__dirname, 'node_modules/@chrisoakman/chessboardjs/dist')));
app.use('/vendor/chess', express.static(path.join(__dirname, 'node_modules/chess.js/dist/esm')));
app.use('/vendor/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/vendor/stockfish', express.static(path.join(__dirname, 'node_modules/stockfish/bin')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
