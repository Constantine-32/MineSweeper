function Minesweeper(options) {
  var NEWG = true
  var ROWS = options.numRows
  var COLS = options.numCols
  var MINE = options.numMines
  var GAME = []
  var HSID = ""

  ;(function() {
    var gamediv = document.getElementById("game");
    gamediv.style.height = ROWS * 16 + "px"
    gamediv.style.width = COLS * 16 + "px"
    for (var row = 1; row <= ROWS; row++) for (var col = 1; col <= COLS; col++) {
      var squarediv = document.createElement("div")
      squarediv.className = "square blank"
      squarediv.id = row+"_"+col
      gamediv.appendChild(squarediv)
    }
  }) ()

  document.addEventListener('mousedown', function (e) {
    if (e.button === 0 && HSID) {
      console.log("Left Click Down on: "+HSID)
    }
    if (e.button === 2 && HSID) {
      console.log("Right Click Down on: "+HSID)
    }
  })
  document.addEventListener('mouseup', function (e) {
    if (e.button === 0 && HSID) {
      console.log("Left Click Up on: "+HSID)
    }
  })
  document.addEventListener('keydown', function (e) {
    if (e.which === 32 && HSID) {
      console.log("Space Key Down on: "+HSID)
    }
  })
  document.addEventListener('mouseover', function (e) {
    if (isSquare(e.target)) {
      HSID = e.target.id
    }
  })
  document.addEventListener('mouseout', function (e) {
    if (isSquare(e.target)) {
      if (HSID = e.target.id) {
        HSID = ""
      }
    }
  })

  function isSquare(element) {
    return element.className.substring(0, 6) === "square"
  }
}

Minesweeper({gameTypeId: 3, numRows: 16, numCols: 30, numMines: 99});