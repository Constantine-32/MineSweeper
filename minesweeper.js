function createGrid(rows, cols) {
  var container = document.getElementById("container")
  var height = rows * 16
  var width = cols * 16
  container.style.width = width+"px"
  container.style.height = height+"px"

  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      var div = document.createElement("div")
      div.className = "square " + matrix[row][col]
      div.id = (row+1)+'_'+(col+1)
      container.appendChild(div)
    }
  }
}

function intToClass(num) {
  switch (num) {
    case 0: return "open0"
    case 1: return "open1"
    case 2: return "open2"
    case 3: return "open3"
    case 4: return "open4"
    case 5: return "open5"
    case 6: return "open6"
    case 7: return "open7"
    case 8: return "open8"
    default: return "blank"
  }
}

function validCoord(row, col) {
  return row >= 0 && row < ROWS && col >= 0 && col < COLS
}

function adjacentBombs(row, col) {
  var adjacentBombs = 0
  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      if (validCoord(row+i, col+j) && matrix[row+i][col+j] === "bombrevealed") {
        adjacentBombs++
      }
    }
  }
  return intToClass(adjacentBombs)
}

var ROWS = 16
var COLS = 30
var mines = 99

var row, col
var matrix = [];
for (row = 0; row < ROWS; row++) {
  matrix[row] = [];
  for (col = 0; col < COLS; col++) {
    matrix[row][col] = "blank";
  }
}
while (mines) {
  row = Math.floor(Math.random() * ROWS)
  col = Math.floor(Math.random() * COLS)
  if (matrix[row][col] === "blank") {
    matrix[row][col] = "bombrevealed"
    mines--
  }
}
for (row = 0; row < ROWS; row++) {
  for (col = 0; col < COLS; col++) {
    if (matrix[row][col] !== "bombrevealed") {
      matrix[row][col] = adjacentBombs(row, col)
    } else matrix[row][col] = "bombflagged"
  }
}

createGrid(ROWS, COLS)