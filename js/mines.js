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
    this._time = 0
    this.siid = null
  }

  set time(value) {
    this._time = value
    this.update()
  }

  get time() {
    return this._time
  }

  start() {
    this.time = 1
    this.siid = setInterval(() => this.time++, 1000)
  }

  stop() {
    clearInterval(this.siid)
  }

  reset() {
    this.stop()
    this.time = 0
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
  constructor(div) {
    this.div = div
    this.nei = undefined
    this.va1 = 0  // { Mine: < 0, Hint: 0-8 }
    this.va2 = 0  // { Open: -1, Cover: 0, Flag: 1 }
  }

  setNei(nei) {
    this.nei = nei
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
    this.nei.map(cell => cell.addVal(1))
  }

  quitMine() {
    this.va1 += 9
    this.nei.map(cell => cell.addVal(-1))
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
    const set = new Set().add(this)
    set.forEach(cell => { if (cell.va1 === 0) cell.nei.forEach(c => set.add(c)) })
    let rev = 0
    set.forEach(cell => { if (cell.reveal()) rev++ })
    return rev
  }

  reveal9() {
    let rev = 0
    if (this.isRevealed()) {
      let flag = 0
      this.nei.forEach(cell => { if (cell.isFlagged()) flag++ })
      if (this.va1 === flag) {
        for (const cell of this.nei) {
          let res = cell.reveal1()
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

  updateSpecial() {
    if (this.va2 !== -1) return
    if (this.va1 === 0) return
    let blank = 0
    let flag = 0
    for (const cell of this.nei) {
      if (cell.va2 === 0) blank += 1
      if (cell.va2 === 1) flag += 1
    }
    if (blank > 0 && (blank + flag <= this.va1 || flag === this.va1))
      this.setClass('xopen' + this.va1)
    else if (flag === this.va1)
      this.setClass('sopen' + this.va1)
    else
      this.setClass('open' + this.va1)
  }
}

class Mineswiper {
  constructor(options) {
    this.clls = []
    this.rows = options.rows >= 1 ? options.rows <= 99 ? options.rows : 99 : 1
    this.cols = options.cols >= 8 ? options.cols <= 99 ? options.cols : 99 : 8
    this.size = this.rows * this.cols
    this.mine = options.mine < this.size ? options.mine : this.size - 1
    this.blnk = this.size - this.mine
    this._minc = this.mine
    this.game = false
    this.firs = true
    this.face = document.getElementById('facebn')
    this.time = new Timer()
    this.newBoard(options.zoom)
    this.newGame()
  }

  set minc(value) {
    this._minc = value
    this.updateMinesDisplay()
  }

  get minc() {
    return this._minc
  }

  toId(row, col) {
    return row * this.cols + col
  }

  newBoard(zoom) {
    const containerDiv = document.getElementById('container')
    containerDiv.style.height = (this.rows * 16 + 39) * zoom + 'px'
    containerDiv.style.width  = (this.cols * 16 +  1) * zoom + 'px'
    containerDiv.style.padding = 10 * zoom + 'px'
    containerDiv.style.borderWidth = zoom + 'px'

    const faceDiv = document.getElementById('facebn')
    faceDiv.style.height = 26 * zoom + 'px'
    faceDiv.style.width  = 26 * zoom + 'px'
    faceDiv.style.marginBottom = 10 * zoom + 'px'
    faceDiv.style.marginLeft  = ((this.cols * 16 - 110) / 2) * zoom + 'px'
    faceDiv.style.marginRight = ((this.cols * 16 - 110) / 2) * zoom + 'px'
    faceDiv.style.borderWidth = zoom + 'px'

    const gameDiv = document.getElementById('game')
    gameDiv.innerHTML = ''
    gameDiv.style.height = (this.rows * 16) * zoom + 'px'
    gameDiv.style.width  = (this.cols * 16) * zoom + 'px'
    gameDiv.style.borderRightWidth = zoom + 'px'
    gameDiv.style.borderBottomWidth = zoom + 'px'

    for (let id = 0; id < this.size; id++) {
      let div = document.createElement('div')
      div.className = 'square blank'
      div.id = id.toString()
      gameDiv.appendChild(div)
      this.clls.push(new Cell(div))
    }

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.clls[this.toId(row, col)].setNei([
            [row-1, col-1], [row-1, col  ], [row-1, col+1], [row  , col-1],
            [row  , col+1], [row+1, col-1], [row+1, col  ], [row+1, col+1]
          ].filter(a => 0 <= a[0] && a[0] < this.rows && 0 <= a[1] && a[1] < this.cols)
            .map(a => this.clls[this.toId(a[0], a[1])])
        )
      }
    }

    this.updateMinesDisplay()
  }

  newGame() {
    for (const cell of this.clls) cell.reset()
    this.blnk = this.size - this.mine
    this.minc = this.mine
    this.game = true
    this.firs = true
    this.time.reset()
  }

  endGame() {
    this.setFace('face3')
    this.game = false
    for (const cell of this.clls) {
      if (cell.isFlagged() && !cell.isMine()) cell.setClass('bomb2')
      if (!cell.isFlagged() && cell.isMine()) cell.setClass('bomb3') // TODO
    }
    this.time.stop()
  }

  winGame() {
    this.setFace('face4')
    this.game = false
    for (const cell of this.clls) {
      if (!cell.isFlagged() && cell.isMine()) {
        cell.flag()
      }
    }
    this.updateSpecial()
    this.minc = 0
    this.time.stop()
  }

  putMine() {
    let cell
    do {
      cell = this.clls[Math.floor(Math.random() * this.size)]
    } while (cell.isMine())
    cell.putMine()
  }

  putMines(id) {
    this.clls[id].putMine()
    this.clls[id].nei.map(cell => cell.addVal(-10))

    for (let i = 0; i < this.mine; i++)
      this.putMine()

    this.clls[id].quitMine()
    this.clls[id].nei.map(cell => cell.addVal(10))
    this.firs = false
  }

  flag(id) {
    if (!this.game) return
    this.minc += this.clls[id].flag()
    game.updateSpecial()
  }

  reveal(id) {
    if (!this.game) return
    if (this.firs) {
      this.putMines(id)
      this.time.start()
    }
    let res = this.clls[id].reveal1()
    game.updateSpecial()
    if (res < 0) {
      this.endGame(id)
      this.clls[id].setClass('bomb1')
    } else {
      this.blnk -= res
      if (this.blnk <= 0)
        this.winGame()
    }
  }

  keydown(id) {
    if (!this.game) return
    if (!this.clls[id].isRevealed()) {
      this.flag(id)
      game.updateSpecial()
      return
    }
    let res = this.clls[id].reveal9()
    game.updateSpecial()
    if (res < 0) {
      this.endGame(id)
    } else {
      this.blnk -= res
      if (this.blnk <= 0) this.winGame()
    }
  }

  press(id) {
    if (this.game) {
      this.clls[id].press()
    }
  }

  unpress(id) {
    if (this.game) {
      this.clls[id].unpress()
    }
  }

  setFace(face) {
    if (face !== 'face2' || face === 'face2' && this.game) {
      this.face.className = face
    }
  }

  updateMinesDisplay() {
    if (this._minc >= 0) {
      document.getElementById('mines-100').className = 'digit digit' + Math.floor(this._minc / 100)
      document.getElementById('mines-10').className = 'digit digit' + Math.floor(this._minc / 10 % 10)
      document.getElementById('mines-1').className = 'digit digit' + Math.floor(this._minc % 10)
    } else {
      document.getElementById('mines-100').className = 'digit digitn'
      document.getElementById('mines-10').className = 'digit digit' + Math.floor(this._minc * -1 / 10 % 10)
      document.getElementById('mines-1').className = 'digit digit' + Math.floor(this._minc * -1 % 10)
    }
  }

  updateSpecial() {
    for (const cell of this.clls)
      cell.updateSpecial()
  }
}

const container = document.getElementById('container')
const game = new Mineswiper({rows: 16, cols: 30, mine: 99, zoom: 2})

let mousedown = false
let facebdown = false
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

function isFaceBn(e) {
  return getId(e) === 'facebn'
}

function getId(e) {
  return e.target.id
}

container.addEventListener('mousedown', function(e) {
  if (mouseLeft(e)) {
    if (isFaceBn(e)) {
      facebdown = true
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
    if (isFaceBn(e) && facebdown) {
      game.newGame()
    } else if (isSquare(e)) {
      game.reveal(id)
    }
    mousedown = false
    facebdown = false
    if (game.game) game.setFace('face0')
  }
})

container.addEventListener('mouseover', function(e) {
  if (isSquare(e)) {
    id = getId(e)
    if (mousedown) game.press(id)
  }
})

container.addEventListener('mouseout', function(e) {
  if (isSquare(e)) {
    if (mousedown) game.unpress(id)
    if (id === getId(e)) id = ''
  }
})

document.addEventListener('keydown', function(e) {
  if (keySpace(e) && id) {
    game.keydown(id)
  } else if (keyF2(e)) {
    game.newGame()
  }
})