'use strict';

/**
 * Minesweeper.js
 * Author: Christian C. Romero
 * Date: February 2018
 * Version: 1.0
 */

class Timer {
  constructor() {
    this.dig1 = document.getElementById('time-100')
    this.dig2 = document.getElementById('time-10')
    this.dig3 = document.getElementById('time-1')
    this.time = 0
    this.siid = null
  }

  start() {
    this.time = 1
    this.update()
    this.siid = setInterval(() => {
      this.time++
      this.update()
    }, 1000)
  }

  stop() {
    clearInterval(this.siid)
  }

  reset() {
    this.stop()
    this.time = 0
    this.update()
  }

  update() {
    if (this.time >= 0 && this.time <= 999) {
      this.dig1.className = 'digit digit' + Math.floor(this.time / 100)
      this.dig2.className = 'digit digit' + Math.floor(this.time / 10 % 10)
      this.dig3.className = 'digit digit' + Math.floor(this.time % 10)
    }
  }
}

class Cell {
  constructor(dict, div, row, col, rows, cols) {
    this.dict = dict
    this.div = div
    this.va1 = 0  // { Mine: < 0, Hint: 0-8 }
    this.va2 = 0  // { Open: -1, Cover: 0, Flag: 1 }
    this.nei = [
      [row-1, col-1], [row-1, col  ], [row-1, col+1], [row  , col-1],
      [row  , col+1], [row+1, col-1], [row+1, col  ], [row+1, col+1]
    ].filter(a => a[0] > 0 && a[0] <= rows && a[1] > 0 && a[1] <= cols).map(a => a[0] + '_' + a[1])
  }

  isMine() {
    return this.va1 < 0
  }

  isFlagged() {
    return this.va2 > 0
  }

  isCovered() {
    return this.va2 === 0
  }

  isRevealed() {
    return this.va2 < 0
  }

  addVal(a) {
    this.va1 += a
  }

  putMine() {
    this.va1 -= 9
    this.nei.map(id => this.dict[id].addVal(1))
  }

  quitMine() {
    this.va1 += 9
    this.nei.map(id => this.dict[id].addVal(-1))
  }

  setClass(a) {
    this.div.className = 'square ' + a
  }

  reset() {
    this.va1 = 0
    this.va2 = 0
    this.setClass('blank')
  }

  flag() {
    if (this.isRevealed()) return 0
    this.va2 ^= 1
    if (this.isFlagged()) {
      this.setClass('bomb0')
      return -1
    }
    this.setClass('blank')
    return 1
  }

  reveal() {
    if (!this.isCovered()) return false
    this.va2 = -1
    this.setClass('open' + this.va1)
    return true
  }

  reveal1() {
    if (this.isMine() && !this.isFlagged()) return -1
    if (this.isFlagged()) return 0
    let set = new Set().add(this)
    for (let cell of set)
      if (cell.va1 === 0)
        for (let id of cell.nei)
          if (this.dict[id])
            set.add(this.dict[id])
    let rev = 0
    for (let cell of set)
      if (cell.reveal())
        rev++
    return rev
  }

  reveal9() {
    let rev = 0
    if (this.isRevealed()) {
      let flag = 0
      this.nei.map(id => { if (this.dict[id].isFlagged()) flag++ })
      if (this.va1 === flag) {
        for (let id of this.nei) {
          let res = this.dict[id].reveal1()
          if (res < 0) return res
          rev += res
        }
      }
    }
    return rev
  }

  press() {
    if (this.isCovered())
      this.setClass('open0')
  }

  unpress() {
    if (this.isCovered() && this.div.className.substring(7) === 'open0')
      this.setClass('blank')
  }
}

class Mineswiper {
  constructor(options) {
    this.dict = {}
    this.rows = options.rows >= 1 ? options.rows <= 99 ? options.rows : 99 : 1
    this.cols = options.cols >= 8 ? options.cols <= 99 ? options.cols : 99 : 8
    this.size = this.rows * this.cols
    this.mine = options.mine < this.size ? options.mine : this.size - 1
    this.blnk = this.size - this.mine
    this.minc = this.mine
    this.game = false
    this.firs = true
    this.face = document.getElementById('reset')
    this.time = new Timer()
    this.newBoard()
    this.newGame()
  }

  newBoard() {
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
        let div = document.createElement('div')
        div.className = 'square blank'
        div.id = row + '_' + col
        gameDiv.appendChild(div)
        this.dict[row + '_' + col] = new Cell(this.dict, div, row, col, this.rows, this.cols)
      }
    }
    this.updateMinesDisplay()
  }

  newGame() {
    for (let row = 1; row <= this.rows; row++) {
      for (let col = 1; col <= this.cols; col++) {
        this.dict[row + '_' + col].reset()
      }
    }
    this.blnk = this.size - this.mine
    this.minc = this.mine
    this.game = true
    this.firs = true
    this.time.reset()
    this.updateMinesDisplay()
  }

  endGame() {
    this.setFace('face3')
    this.game = false
    for (let row = 1; row <= this.rows; row++) {
      for (let col = 1; col <= this.cols; col++) {
        let cell = this.dict[row + '_' + col]
        if (!cell.isFlagged() && cell.isMine()) cell.setClass('bomb3')
        if (cell.isFlagged() && !cell.isMine()) cell.setClass('bomb2')
      }
    }
    this.time.stop()
  }

  winGame() {
    this.setFace('face4')
    this.game = false
    for (let row = 1; row <= this.rows; row++) {
      for (let col = 1; col <= this.cols; col++) {
        let cell = this.dict[row + '_' + col]
        if (!cell.isFlagged() && cell.isMine()) cell.setClass('bomb0')
      }
    }
    this.minc = 0
    this.time.stop()
    this.updateMinesDisplay()
  }

  static rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  putMine() {
    let row, col
    do {
      row = Mineswiper.rand(1, this.rows)
      col = Mineswiper.rand(1, this.cols)
    } while (this.dict[row+'_'+col].isMine())
    this.dict[row+'_'+col].putMine()
  }

  putMines(id) {
    this.dict[id].putMine()
    this.dict[id].nei.map(id => this.dict[id].addVal(-10))

    for (let i = 0; i < this.mine; i++)
      this.putMine()

    this.dict[id].quitMine()
    this.dict[id].nei.map(id => this.dict[id].addVal(10))
    this.firs = false
  }

  flag(id) {
    if (!this.game) return
    this.minc += this.dict[id].flag()
    this.updateMinesDisplay()
  }

  reveal(id) {
    if (!this.game) return
    if (this.firs) {
      this.putMines(id)
      this.time.start()
    }
    let res = this.dict[id].reveal1()
    if (res < 0) {
      this.endGame(id)
      this.dict[id].setClass('bomb1')
    } else {
      this.blnk -= res
      if (this.blnk <= 0) this.winGame()
    }
  }

  keydown(id) {
    if (!this.game) return
    if (!this.dict[id].isRevealed()) {
      this.flag(id)
      return
    }
    let res = this.dict[id].reveal9()
    if (res < 0) {
      this.endGame(id)
    } else {
      this.blnk -= res
      if (this.blnk <= 0) this.winGame()
    }
  }

  press(id) {
    if (this.game) {
      this.dict[id].press()
    }
  }

  unpress(id) {
    if (this.game) {
      this.dict[id].unpress()
    }
  }

  setFace(a) {
    if (this.game) {
      this.face.className = a
    }
  }

  updateMinesDisplay() {
    if (this.minc >= 0) {
      document.getElementById('mines-100').className = 'digit digit' + Math.floor(this.minc / 100)
      document.getElementById('mines-10').className = 'digit digit' + Math.floor(this.minc / 10 % 10)
      document.getElementById('mines-1').className = 'digit digit' + Math.floor(this.minc % 10)
    } else {
      document.getElementById('mines-100').className = 'digit digitn'
      document.getElementById('mines-10').className = 'digit digit' + Math.floor(this.minc * -1 / 10 % 10)
      document.getElementById('mines-1').className = 'digit digit' + Math.floor(this.minc * -1 % 10)
    }
  }
}

const game = new Mineswiper({rows: 16, cols: 30, mine: 99})

// Event Listeners
let mousedown = false
let resetdown = false
let id = ''

function mouseLeft(e) {
  return e.button === 0
}

function mouseRigth(e) {
  return e.button === 2
}

function keySpace(e) {
  return e.which === 32
}

function keyF2(e) {
  return e.which === 113
}

function isSquare(e) {
  return e.target.className.substring(0, 6) === 'square'
}

function isReset(e) {
  return getId(e) === 'reset'
}

function getId(e) {
  return e.target.id
}

document.addEventListener('mousedown', function(e) {
  if (mouseLeft(e)) {
    if (isReset(e)) {
      resetdown = true
      game.setFace('face1')
    } else if (isSquare(e)) {
      mousedown = true
      game.press(id)
      game.setFace('face2')
    }
  } else if (mouseRigth(e) && isSquare(e)) {
    game.flag(id)
  }
})

document.addEventListener('mouseup', function(e) {
  if (mouseLeft(e)) {
    if (isReset(e) && resetdown) {
      game.newGame()
    } else if (isSquare(e)) {
      game.reveal(id)
    }
    mousedown = false
    resetdown = false
    game.setFace('face0')
  }
})

document.addEventListener('keydown', function(e) {
  if (keySpace(e) && id) {
    game.keydown(id)
  } else if (keyF2(e)) {
    game.newGame()
  }
})

document.addEventListener('mouseover', function(e) {
  if (isSquare(e)) {
    id = getId(e)
    if (mousedown) game.press(id)
  }
})

document.addEventListener('mouseout', function(e) {
  if (isSquare(e)) {
    if (mousedown) game.unpress(id)
    if (id === getId(e)) id = ''
  }
})