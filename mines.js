'use strict';

/**
 * Minesweeper.js
 * Author: Christian C. Romero
 * Date: February 2018
 * Version: 1.0
 */

class Minesweeper {
  constructor(options) {
    this.rows = options.rows
    this.cols = options.cols
    this.mine = options.mine
    this.game = true

    const containerDiv = document.getElementById('container')
    containerDiv.style.height = (this.rows * 16 + 39) + 'px'
    containerDiv.style.width  = (this.cols * 16 +  1) + 'px'

    const resetDiv = document.getElementById('reset')
    resetDiv.style.marginLeft  = ((this.cols * 16 - 110) / 2) + 'px'
    resetDiv.style.marginRight = ((this.cols * 16 - 110) / 2) + 'px'

    const gameDiv = document.getElementById('game')
    gameDiv.innerHTML = ''
    gameDiv.style.height = (this.rows * 16) + 'px'
    gameDiv.style.width  = (this.cols * 16) + 'px'

    for (let row = 1; row <= this.rows; row++) {
      for (let col = 1; col <= this.cols; col++) {
        let squarediv = document.createElement("div")
        squarediv.className = "square blank"
        squarediv.id = row + "_" + col
        gameDiv.appendChild(squarediv)
      }
    }
  }
}

new Minesweeper({rows: 16, cols: 30, mine: 99});

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
