'use strict';

/**
 * Minesweeper.js
 * Author: Christian C. Romero
 * Date: February 2018
 * Version: 1.0
 */

class Minesweeper {
  constructor(options) {
    this.NEWG = true
    this.ROWS = options.numRows
    this.COLS = options.numCols
    this.MINE = options.numMines
    this.GAME = []

    let gamediv = document.getElementById("game");
    gamediv.style.height = this.ROWS * 16 + "px"
    gamediv.style.width = this.COLS * 16 + "px"
    for (let row = 1; row <= this.ROWS; row++) {
      for (let col = 1; col <= this.COLS; col++) {
        let squarediv = document.createElement("div")
        squarediv.className = "square blank"
        squarediv.id = row + "_" + col
        gamediv.appendChild(squarediv)
      }
    }
  }
}

new Minesweeper({gameTypeId: 3, numRows: 16, numCols: 30, numMines: 99});

let HSID = ''

function isSquare(element) {
  return element.className.substring(0, 6) === "square"
}

document.addEventListener('mousedown', function (e) {
  if (e.button === 0 && HSID) {
    console.log("Left Click Down on: " + HSID)
  }
  if (e.button === 2 && HSID) {
    console.log("Right Click Down on: " + HSID)
  }
})
document.addEventListener('mouseup', function (e) {
  if (e.button === 0 && HSID) {
    console.log("Left Click Up on: " + HSID)
  }
})
document.addEventListener('keydown', function (e) {
  if (e.which === 32 && HSID) {
    console.log("Space Key Down on: " + HSID)
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
