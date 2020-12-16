// Initialize the background colors for the board
for (let i = 0; i < 64; i++) {
  if (Math.floor(i / 8) % 2 === 0 && i % 2 === 0 || Math.floor(i / 8) % 2 !== 0 && i % 2 !== 0) {
    $('button').eq(i).css('background-color', '#e0ae2d')
  } else {
    $('button').eq(i).css('background-color', '#7a4a17')
  }
}

// Initialize images
function createImage (link) {
  return `<image src='${link}' width='50' height='50'></image>`
}

const whitePawn = createImage('http://www.clker.com/cliparts/f/a/5/7/12065718932136586127akiross_Chess_Set_1.svg.med.png')
const blackPawn = createImage('http://www.clker.com/cliparts/6/f/1/b/1206571937784334796akiross_Chess_Set_7.svg.med.png')
const whiteKnight = createImage('http://www.clker.com/cliparts/5/9/d/9/12065719081670854669akiross_Chess_Set_3.svg.med.png')
const blackKnight = createImage('http://www.clker.com/cliparts/0/f/7/f/12065719521009467729akiross_Chess_Set_9.svg.med.png')
const whiteBishop = createImage('http://www.clker.com/cliparts/6/4/a/5/12065719151168623253akiross_Chess_Set_4.svg.med.png')
const blackBishop = createImage('http://www.clker.com/cliparts/6/c/2/b/12065719601120389952akiross_Chess_Set_10.svg.med.png')
const whiteQueen = createImage('http://www.clker.com/cliparts/6/f/7/9/12065719231737836935akiross_Chess_Set_5.svg.med.png')
const blackQueen = createImage('http://www.clker.com/cliparts/b/4/7/f/12065719671215835189akiross_Chess_Set_11.svg.med.png')
const whiteKing = createImage('http://www.clker.com/cliparts/8/d/a/c/12065719301527417470akiross_Chess_Set_6.svg.med.png')
const blackKing = createImage('http://www.clker.com/cliparts/7/e/5/a/12065719751931377215akiross_Chess_Set_12.svg.med.png')
const whiteRook = createImage('http://www.clker.com/cliparts/b/7/7/a/1206571900418344921akiross_Chess_Set_2.svg.med.png')
const blackRook = createImage('http://www.clker.com/cliparts/2/6/c/d/1206571945914509596akiross_Chess_Set_8.svg.med.png')

const allPieces = []
let currentPiece = null
let previousPiece = null

class GeneralObj {
  constructor (x, y, color, name) {
    this.x = x
    this.y = y
    this.buttonNumber = x + y * 8
    this.name = name
    this.color = color
    this.hasMoved = false
  }

  draw (oldX, oldY) {
    $('button').eq(oldX + oldY * 8).html('')
    if (this.name === 'pawn') {
      if (this.color === 'white') {
        $('button').eq(this.buttonNumber).html(whitePawn)
      } else {
        $('button').eq(this.buttonNumber).html(blackPawn)
      }
    } else if (this.name === 'knight') {
      if (this.color === 'white') {
        $('button').eq(this.buttonNumber).html(whiteKnight)
      } else {
        $('button').eq(this.buttonNumber).html(blackKnight)
      }
    } else if (this.name === 'bishop') {
      if (this.color === 'white') {
        $('button').eq(this.buttonNumber).html(whiteBishop)
      } else {
        $('button').eq(this.buttonNumber).html(blackBishop)
      }
    } else if (this.name === 'Queen') {
      if (this.color === 'white') {
        $('button').eq(this.buttonNumber).html(whiteQueen)
      } else {
        $('button').eq(this.buttonNumber).html(blackQueen)
      }
    } else if (this.name === 'rook') {
      if (this.color === 'white') {
        $('button').eq(this.buttonNumber).html(whiteRook)
      } else {
        $('button').eq(this.buttonNumber).html(blackRook)
      }
    } else {
      if (this.color === 'white') {
        $('button').eq(this.buttonNumber).html(whiteKing)
      } else {
        $('button').eq(this.buttonNumber).html(blackKing)
      }
    }
    $('button').removeClass('highlight')
  }

  getPiece (x, y) {
    let piece = null
    let aPiece
    for (aPiece of allPieces) {
      if (aPiece.x === x && aPiece.y === y) {
        piece = aPiece
      }
    }

    return piece
  }

  getPieceByType (name, color) {
    let piece = null
    let aPiece
    for (aPiece of allPieces) {
      if (aPiece.name === name && aPiece.color === color) {
        piece = aPiece
      }
    }
    return piece
  }

  getPieceByTypeAndLocation (name, color, x, y) {
    let piece = null
    let aPiece
    for (aPiece of allPieces) {
      if (aPiece.name === name && aPiece.color === color &&
          aPiece.y === y && aPiece.x === x) {
        piece = aPiece
      }
    }
    return piece
  }

  exploreDiagonal (newX, newY, check) {
    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 && check) {
      if (this.getPiece(newX, newY) !== null) {
        if (this.getPiece(newX, newY).color !== this.color) {
          this.range.push(newX)
          this.range.push(newY)
        }
        return false
      } else {
        this.range.push(newX)
        this.range.push(newY)
        return true
      }
    }
    return false
  }

  displayRange () {
    const range = this.getRange()

    // Give the player the option to deselect a piece
    if (range.length !== 0) {
      if ($('button').eq(range[0] + 8 * range[1]).hasClass('highlight')) {
        $('button').removeClass('highlight')
        return
      }
    }

    $('button').removeClass('highlight')
    for (let coord = 0; coord < range.length; coord += 2) {
      if (this.checkInvalidMove(range[coord], range[coord + 1])) {
        continue
      }
      $('button').eq(range[coord] + 8 * range[coord + 1]).addClass('highlight')
    }
  }

  isValidMove (x, y, range) {
    const rangeLength = range.length
    for (let i = 0; i < rangeLength - 1; i += 2) {
      if (range[i] === x && range[i + 1] === y) {
        return true
      }
    }
    return false
  }

  checkInvalidMove (x, y) {
    // Castling
    if ((x === 6 || x === 2) && this.name === 'king' && !this.hasMoved) {
      // Handled logic for castling in KingObj
      return false
    }

    let toDelete = this.getPiece(x, y)

    if (toDelete !== null && toDelete.name === 'king') {
      return true
    }

    // En passant
    if (toDelete === null && this.name === 'pawn' &&
        Math.abs(x - this.x) === 1 && y === this.y + this.direction) {
      toDelete = this.getPiece(x, this.y)
    }

    if (toDelete !== null) {
      allPieces.splice(allPieces.indexOf(toDelete), 1)
    }
    const oldX = this.x
    const oldY = this.y
    this.x = x
    this.y = y
    this.buttonNumber = x + y * 8

    let output = false

    // Check Error Check
    if (this.getPieceByType('king', this.color).isChecked()) {
      output = true
    }

    if (toDelete !== null) {
      allPieces.push(toDelete)
      // toDelete.draw()
    }
    this.x = oldX
    this.y = oldY
    this.buttonNumber = oldX + oldY * 8
    // this.draw()
    return output
  }

  move (x, y, override = false) {
    let toDelete = this.getPiece(x, y)

    if (toDelete !== null && toDelete.name === 'king') {
      return toDelete
    }

    // En passant
    if (toDelete === null && this.name === 'pawn' &&
        Math.abs(x - this.x) === 1 && y === this.y + this.direction) {
      toDelete = this.getPiece(x, this.y)
      $('button').eq(x + this.y * 8).text('')
    }

    if (toDelete !== null) {
      allPieces.splice(allPieces.indexOf(toDelete), 1)
    }
    const oldX = this.x
    const oldY = this.y
    this.x = x
    this.y = y
    this.buttonNumber = x + y * 8

    // Account for castling
    let castlingRook = null
    if (x === 6 && this.name === 'king' && !this.hasMoved) {
      castlingRook = this.getPieceByTypeAndLocation('rook', this.color, 7, this.y)
      castlingRook.move(5, this.y, true)
      castlingRook.draw(7, this.y)
    }
    if (x === 2 && this.name === 'king' && !this.hasMoved) {
      castlingRook = this.getPieceByTypeAndLocation('rook', this.color, 0, this.y)
      castlingRook.move(3, this.y, true)
      castlingRook.draw(0, this.y)
    }

    // Check Error Check
    if (!override) {
      if (this.getPieceByType('king', this.color).isChecked()) {
        $('button').removeClass('highlight')
        if (toDelete !== null) {
          allPieces.push(toDelete)
          toDelete.draw()
        }
        this.x = oldX
        this.y = oldY
        this.buttonNumber = oldX + oldY * 8
        this.draw()
        if (castlingRook !== null) {
          if (x === 6) {
            castlingRook.move(7, this.y, true)
            castlingRook.draw(5, this.y)
          } else {
            castlingRook.move(0, this.y, true)
            castlingRook.draw(3, this.y)
          }
        }
        return 'Self Check'
      }
    }

    this.draw(oldX, oldY)
    this.hasMoved = true
    // Pawn promotion
    if (this.name === 'pawn' &&
        (this.y + this.direction < 0 || this.y + this.direction > 7)) {
      console.log(this)
      let response = ''
      const options = ['Queen', 'rook', 'knight', 'bishop']
      while (!options.includes(response)) {
        response = prompt('What would you like to promote your pawn to? Queen, rook, bishop, or knight? ')
      }
      let desiredPiece = null
      if (response === options[0]) {
        desiredPiece = new QueenObj(this.x, this.y, this.color)
      } else if (response === options[1]) {
        desiredPiece = new RookObj(this.x, this.y, this.color)
      } else if (response === options[2]) {
        desiredPiece = new KnightObj(this.x, this.y, this.color)
      } else if (response === options[3]) {
        desiredPiece = new BishopObj(this.x, this.y, this.color)
      }
      const index = allPieces.indexOf(this)
      allPieces.splice(index, 1)
      desiredPiece.draw(this.x, this.y)
      allPieces.push(desiredPiece)
    }
    return toDelete
  }
}

class PawnObj extends GeneralObj {
  constructor (x, y, color) {
    super(x, y, color, 'pawn')
    this.direction = (color === 'white') ? -1 : 1
    this.hasMoved = false
  }

  getRange () {
    this.range = []
    let newX = this.x
    let newY = this.y + this.direction
    let toContinue = this.exploreDiagonal(newX, newY, true)
    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 &&
        !toContinue) {
      this.range.pop()
      this.range.pop()
    }

    newY = this.y + 2 * this.direction
    if (!this.hasMoved) {
      toContinue = this.exploreDiagonal(newX, newY, toContinue)
      if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 &&
          !toContinue) {
        this.range.pop()
        this.range.pop()
      }
    }

    newX = this.x - this.direction
    newY = this.y + this.direction
    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 &&
        this.exploreDiagonal(newX, newY, true)) {
      this.range.pop()
      this.range.pop()
    }

    newX = this.x + this.direction
    newY = this.y + this.direction
    if (this.exploreDiagonal(newX, newY, true)) {
      this.range.pop()
      this.range.pop()
    }

    // Empasson implementation
    if (previousPiece !== null) {
      if (previousPiece.name === 'pawn' && previousPiece.color !== this.color) {
        const rank = this.color === 'white' ? 3 : 4;
        if (previousPiece.y === this.y && Math.abs(previousPiece.x - this.x) === 1 &&
            this.y === rank) {
          this.range.push(previousPiece.x)
          this.range.push(previousPiece.y + this.direction)
        }
      }
    }

    return this.range
  }
}

class BishopObj extends GeneralObj {
  constructor (x, y, color) {
    super(x, y, color, 'bishop')
  }

  getRange () {
    let tl = true
    let tr = true
    let br = true
    let bl = true
    this.range = []

    for (let i = 1; i < 8; i++) {
      let newX = this.x - i
      let newY = this.y + i
      // Effort for top left
      tl = this.exploreDiagonal(newX, newY, tl)

      // Effort for top right
      newX = this.x + i
      newY = this.y + i
      tr = this.exploreDiagonal(newX, newY, tr)

      // Effort for bottom right
      newX = this.x + i
      newY = this.y - i
      br = this.exploreDiagonal(newX, newY, br)

      // Effort for bottom left
      newX = this.x - i
      newY = this.y - i
      bl = this.exploreDiagonal(newX, newY, bl)
    }
    return this.range
  }
}

class RookObj extends GeneralObj {
  constructor (x, y, color) {
    super(x, y, color, 'rook')
  }

  getRange () {
    let u = true
    let r = true
    let d = true
    let l = true
    this.range = []

    for (let i = 1; i < 8; i++) {
      let newX = this.x
      let newY = this.y + i
      // Effort for up
      u = this.exploreDiagonal(newX, newY, u)

      // Effort for right
      newX = this.x + i
      newY = this.y
      r = this.exploreDiagonal(newX, newY, r)

      // Effort for bottom
      newX = this.x
      newY = this.y - i
      d = this.exploreDiagonal(newX, newY, d)

      // Effort for left
      newX = this.x - i
      newY = this.y
      l = this.exploreDiagonal(newX, newY, l)
    }
    return this.range
  }
}

class QueenObj extends GeneralObj {
  constructor (x, y, color) {
    super(x, y, color, 'Queen')
  }

  getRange () {
    let u = true
    let r = true
    let d = true
    let l = true
    let tl = true
    let tr = true
    let br = true
    let bl = true

    this.range = []

    for (let i = 1; i < 8; i++) {
      let newX = this.x
      let newY = this.y - i
      // Effort for up
      u = this.exploreDiagonal(newX, newY, u)

      // Effort for right
      newX = this.x + i
      newY = this.y
      r = this.exploreDiagonal(newX, newY, r)

      // Effort for bottom
      newX = this.x
      newY = this.y + i
      d = this.exploreDiagonal(newX, newY, d)

      // Effort for left
      newX = this.x - i
      newY = this.y
      l = this.exploreDiagonal(newX, newY, l)

      // Effort for top left
      newX = this.x - i
      newY = this.y - i
      tl = this.exploreDiagonal(newX, newY, tl)

      // Effort for top right
      newX = this.x + i
      newY = this.y - i
      tr = this.exploreDiagonal(newX, newY, tr)

      // Effort for bottom right
      newX = this.x + i
      newY = this.y + i
      br = this.exploreDiagonal(newX, newY, br)

      // Effort for bottom left
      newX = this.x - i
      newY = this.y + i
      bl = this.exploreDiagonal(newX, newY, bl)
    }
    // console.log(this.range)
    return this.range
  }
}

class KnightObj extends GeneralObj {
  constructor (x, y, color) {
    super(x, y, color, 'knight')
  }

  getRange () {
    this.range = []
    let newX = this.x - 1
    let newY = this.y - 2
    this.exploreDiagonal(newX, newY, true)

    newX = this.x + 1
    newY = this.y - 2
    this.exploreDiagonal(newX, newY, true)

    newX = this.x + 2
    newY = this.y - 1
    this.exploreDiagonal(newX, newY, true)

    newX = this.x + 2
    newY = this.y + 1
    this.exploreDiagonal(newX, newY, true)

    newX = this.x + 1
    newY = this.y + 2
    this.exploreDiagonal(newX, newY, true)

    newX = this.x - 1
    newY = this.y + 2
    this.exploreDiagonal(newX, newY, true)

    newX = this.x - 2
    newY = this.y + 1
    this.exploreDiagonal(newX, newY, true)

    newX = this.x - 2
    newY = this.y - 1
    this.exploreDiagonal(newX, newY, true)

    return this.range
  }
}

class KingObj extends GeneralObj {
  constructor (x, y, color) {
    super(x, y, color, 'king')
  }

  getRange (castling = true) {
    this.range = []
    let newX = this.x
    let newY = this.y - 1
    this.exploreDiagonal(newX, newY, true)

    newX = this.x + 1
    newY = this.y
    this.exploreDiagonal(newX, newY, true)

    newX = this.x
    newY = this.y + 1
    this.exploreDiagonal(newX, newY, true)

    newX = this.x - 1
    newY = this.y
    this.exploreDiagonal(newX, newY, true)

    newX = this.x + 1
    newY = this.y - 1
    this.exploreDiagonal(newX, newY, true)

    newX = this.x + 1
    newY = this.y + 1
    this.exploreDiagonal(newX, newY, true)

    newX = this.x - 1
    newY = this.y + 1
    this.exploreDiagonal(newX, newY, true)

    newX = this.x - 1
    newY = this.y - 1
    this.exploreDiagonal(newX, newY, true)

    // Implementing Castling
    if (castling && !this.hasMoved && !this.isChecked()) {
      const rook = this.getPieceByTypeAndLocation('rook', this.color, 7, this.y)
      if (rook !== null && !rook.hasMoved) {
        if (this.getPiece(5, this.y) === null && !this.isChecked(5) &&
            this.getPiece(6, this.y) === null && !this.isChecked(6)) {
          this.range.push(6)
          this.range.push(this.y)
        }
      }
      const rook2 = this.getPieceByTypeAndLocation('rook', this.color, 0, this.y)
      if (rook2 !== null && !rook2.hasMoved) {
        if (this.getPiece(3, this.y) === null && !this.isChecked(3) &&
            this.getPiece(2, this.y) === null && !this.isChecked(2) &&
            this.getPiece(1, this.y) === null && !this.isChecked(1)) {
          this.range.push(2)
          this.range.push(this.y)
        }
      }
    }

    return this.range
  }

  isChecked (x = this.x, y = this.y) {
    let piece
    for (piece of allPieces) {
      if (piece.color !== this.color) {
        let range
        if (piece.name === 'king') {
          range = piece.getRange(false)
        } else {
          range = piece.getRange()
        }
        for (let i = 0; i < range.length - 1; i += 2) {
          if (range[i] === x && range[i + 1] === y) {
            return true
          }
        }
      }
    }
    return false
  }

  isCheckmated () {
    let piece
    for (piece of allPieces) {
      if (piece.color === this.color) {
        const range = piece.getRange()
        for (let i = 0; i < range.length - 1; i += 2) {
          const x = piece.x
          const y = piece.y
          const hasMoved = piece.hasMoved
          const response = piece.move(range[i], range[i + 1])
          if (response === null) {
            piece.move(x, y, true)
            piece.hasMoved = hasMoved
            return false
          } else if (response !== 'Self Check') {
            piece.move(x, y, true)
            piece.hasMoved = hasMoved
            allPieces.push(response)
            response.draw()
            return false
          }
        }
      }
    }
    return true
  }
}

// Beginning of setting environment for game

for (let row = 0; row < 8; row++) {
  if (row > 1 && row < 6) {
    continue
  }
  let color = 'white'
  for (let col = 0; col < 8; col++) {
    if (row < 2) {
      color = 'black'
    }
    if (row === 1) {
      allPieces.push(new PawnObj(col, row, color))
    } else if (row === 6) {
      allPieces.push(new PawnObj(col, row, color))
    } else if (col === 2 || col === 5) {
      allPieces.push(new BishopObj(col, row, color))
    } else if (col === 0 || col === 7) {
      allPieces.push(new RookObj(col, row, color))
    } else if (col === 3) {
      allPieces.push(new QueenObj(col, row, color))
    } else if (col === 1 || col === 6) {
      allPieces.push(new KnightObj(col, row, color))
    } else {
      allPieces.push(new KingObj(col, row, color))
    }
  }
}
for (const piece of allPieces) {
  piece.draw()
}

// Respond to click to show moves
let turn = 'white'
$('button').click(function () {
  const index = $('button').index(this)

  // Get the piece if it exists
  let piece = null
  for (const aPiece of allPieces) {
    if (aPiece.buttonNumber === index) {
      piece = aPiece
    }
  }

  if ($(this).hasClass('highlight')) {
    // Handle the movement of an object into space
    currentPiece.move(index % 8, Math.floor(index / 8))
    const desiredColor = currentPiece.color === 'white' ? 'black' : 'white'
    turn = desiredColor

    // Rotate based on turn here
    if (turn === 'black') {
      $('table').addClass('rotate')
      $('button').addClass('rotate')
    } else {
      $('table').removeClass('rotate')
      $('button').removeClass('rotate')
    }
    $('h3').eq(1).text(`It is ${turn}'s turn to play`)
    checkMate(desiredColor)

  } else if (piece !== null && piece.color === turn) {
    // Handle the selection of a piece to see possible moves
    if (piece !== currentPiece) {
      previousPiece = currentPiece
      currentPiece = piece
    }
    piece.displayRange()
  } else {
    $('button').removeClass('highlight')
  }
})

function checkMate (color) {
  let piece
  for (piece of allPieces) {
    if (piece.name === 'king' && piece.color === color) {
      if (piece.isCheckmated() && piece.isChecked()) {
        $('h3').eq(1).html(`<h3 align='center'>
        ${piece.color.charAt(0).toUpperCase() + piece.color.slice(1)}
        has been checkmated!</h3>`)
        $('button').off('click')
        return true
      }
    }
  }
  return false
}
