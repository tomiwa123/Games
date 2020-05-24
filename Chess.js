// Initialize the background colors for the board
for (let i = 0; i < 64; i++) {
    if (Math.floor(i / 8) % 2 == 0 && i % 2 == 0 || Math.floor(i / 8) % 2 != 0 && i % 2 != 0) {
      $("button").eq(i).css("background-color", "#e0ae2d")
    } else {
      $("button").eq(i).css("background-color", "#7a4a17")
    }
}

pawn = "<image src=\"pawn.png\" width=\"50\" height=\"50\"></image>"

let allPieces = []

class PawnObj  {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.buttonNumber = x + y * 8;
    this.name = "pawn";
    this.color = color;
    this.direction = (color === "white") ? -1 : 1;
    this.hasMoved = false;
  }

  draw() {
    $("button").eq(this.buttonNumber).text(this.color+" "+this.name);
  }

  draw(oldX, oldY) {
    $("button").eq(oldX + oldY * 8).text("");
    $("button").eq(this.buttonNumber).text(this.color+" "+this.name);
    $("button").removeClass("highlight")
  }

  getRange() {
    let range = [this.x, this.y + this.direction,
                  this.x, this.y + 2 * this.direction]
    if (this.hasMoved) {
        range.pop()
        range.pop()
    }
    // Cannot move if another object in position
    for (piece of allPieces) {
      if (piece.x === this.x && piece.y === this.y + this.direction) {
        range.shift()
        range.shift()
      }
      if (range.length === 4) {
        if (piece.x === this.x && piece.y === this.y + this.direction * 2) {
          range.pop()
          range.pop()
        }
      }
    }

    // Allow for capturing
    for (piece of allPieces) {
      if (piece.color != this.color &&
          Math.abs(piece.x - this.x) === 1 &&
          piece.y == this.y + this.direction) {
        range.push(piece.x)
        range.push(piece.y)
      }
    }
    let newRange = []
    for (let x = 0; x < range.length - 1; x+=2) {
      let y = x + 1
      if (!(range[x] < 0 || range[y] < 0 ||
          range[x] > 7 || range[y] > 7)) {
            newRange.push(range[x])
            newRange.push(range[y])
          }
    }
    return newRange
  }

  displayRange() {
    if ($("button").hasClass("highlight")) {
      $("button").removeClass("highlight")
      return
    }
    const range = this.getRange()
    for (let coord = 0; coord < range.length; coord += 2) {
      $("button").eq(range[coord] + 8 * range[coord + 1]).toggleClass("highlight")
    }
  }

  isValidMove(x, y, range) {
    const rangeLength = range.length
    for (let i = 0; i < rangeLength - 1; i += 2) {
      if (range[i] == x && range[i+1] == y) {
        return true
      }
    }
    return false
  }

  move(x, y) {
    const range = this.getRange()
    if (!this.isValidMove(x, y, range)) {
      console.log(`${x},${y},${yIndex},${xIndex}`)
      console.log(range)
      console.log("Invalid move. Nothing Done.")
    } else {
      let toDelete = null
      for (piece of allPieces) {
        if (piece.x === x && piece.y === y) {
          toDelete = piece
        }
      }
      if (toDelete !== null) {
        allPieces.splice(allPieces.indexOf(toDelete), 1)
      }
      const oldX = this.x;
      const oldY = this.y;
      this.x = x;
      this.y = y;
      this.buttonNumber = x + y * 8;
      this.draw(oldX, oldY);
      this.hasMoved = true;
    }
  }
}

class BishopObj  {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.buttonNumber = x + y * 8;
    this.name = "bishop";
    this.color = color;
  }

  draw() {
    $("button").eq(this.buttonNumber).text(this.color+" "+this.name);
  }

  draw(oldX, oldY) {
    $("button").eq(oldX + oldY * 8).text("");
    $("button").eq(this.buttonNumber).text(this.color+" "+this.name);
    $("button").removeClass("highlight")
  }

  getPiece(x, y) {
    piece = null
    for (aPiece of allPieces) {
      if (aPiece.x === x && aPiece.y === y) {
        piece = aPiece
      }
    }
    return piece
  }

  exploreDiagonal(newX, newY, check) {
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

  getRange() {
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

  displayRange() {
    if ($("button").hasClass("highlight")) {
      $("button").removeClass("highlight")
      return
    }
    const range = this.getRange()
    for (let coord = 0; coord < range.length; coord += 2) {
      $("button").eq(range[coord] + 8 * range[coord + 1]).toggleClass("highlight")
    }
  }

  isValidMove(x, y, range) {
    const rangeLength = range.length
    for (let i = 0; i < rangeLength - 1; i += 2) {
      if (range[i] == x && range[i+1] == y) {
        return true
      }
    }
    return false
  }

  move(x, y) {
    const range = this.getRange()
    if (!this.isValidMove(x, y, range)) {
      console.log(`${x},${y},${yIndex},${xIndex}`)
      console.log(range)
      console.log("Invalid move. Nothing Done.")
    } else {
      let toDelete = null
      for (piece of allPieces) {
        if (piece.x === x && piece.y === y) {
          toDelete = piece
        }
      }
      if (toDelete !== null) {
        allPieces.splice(allPieces.indexOf(toDelete), 1)
      }
      const oldX = this.x;
      const oldY = this.y;
      this.x = x;
      this.y = y;
      this.buttonNumber = x + y * 8;
      this.draw(oldX, oldY);
      this.hasMoved = true;
    }
  }
}

class RookObj  {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.buttonNumber = x + y * 8;
    this.name = "rook";
    this.color = color;
  }

  draw() {
    $("button").eq(this.buttonNumber).text(this.color+" "+this.name);
  }

  draw(oldX, oldY) {
    $("button").eq(oldX + oldY * 8).text("");
    $("button").eq(this.buttonNumber).text(this.color+" "+this.name);
    $("button").removeClass("highlight")
  }

  getPiece(x, y) {
    piece = null
    for (aPiece of allPieces) {
      if (aPiece.x === x && aPiece.y === y) {
        piece = aPiece
      }
    }
    return piece
  }

  exploreDiagonal(newX, newY, check) {
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

  getRange() {
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

  displayRange() {
    if ($("button").hasClass("highlight")) {
      $("button").removeClass("highlight")
      return
    }
    const range = this.getRange()
    for (let coord = 0; coord < range.length; coord += 2) {
      $("button").eq(range[coord] + 8 * range[coord + 1]).toggleClass("highlight")
    }
  }

  isValidMove(x, y, range) {
    const rangeLength = range.length
    for (let i = 0; i < rangeLength - 1; i += 2) {
      if (range[i] == x && range[i+1] == y) {
        return true
      }
    }
    return false
  }

  move(x, y) {
    const range = this.getRange()
    if (!this.isValidMove(x, y, range)) {
      console.log(`${x},${y},${yIndex},${xIndex}`)
      console.log(range)
      console.log("Invalid move. Nothing Done.")
    } else {
      let toDelete = null
      for (piece of allPieces) {
        if (piece.x === x && piece.y === y) {
          toDelete = piece
        }
      }
      if (toDelete !== null) {
        allPieces.splice(allPieces.indexOf(toDelete), 1)
      }
      const oldX = this.x;
      const oldY = this.y;
      this.x = x;
      this.y = y;
      this.buttonNumber = x + y * 8;
      this.draw(oldX, oldY);
      this.hasMoved = true;
    }
  }
}

class QueenObj  {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.buttonNumber = x + y * 8;
    this.name = "Queen";
    this.color = color;
  }

  draw() {
    $("button").eq(this.buttonNumber).text(this.color+" "+this.name);
  }

  draw(oldX, oldY) {
    $("button").eq(oldX + oldY * 8).text("");
    $("button").eq(this.buttonNumber).text(this.color+" "+this.name);
    $("button").removeClass("highlight")
  }

  getPiece(x, y) {
    piece = null
    for (aPiece of allPieces) {
      if (aPiece.x === x && aPiece.y === y) {
        piece = aPiece
      }
    }
    return piece
  }

  exploreDiagonal(newX, newY, check) {
    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 && check) {
      console.log(this.getPiece(newX, newY))
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

  getRange() {
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
      console.log(tl)
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

  displayRange() {
    if ($("button").hasClass("highlight")) {
      $("button").removeClass("highlight")
      return
    }
    const range = this.getRange()
    console.log("New Loop")
    for (let coord = 0; coord < range.length; coord += 2) {
      console.log(`${range[coord]} ${range[coord + 1]}`)
      $("button").eq(range[coord] + 8 * range[coord + 1]).toggleClass("highlight")
    }
  }

  isValidMove(x, y, range) {
    const rangeLength = range.length
    for (let i = 0; i < rangeLength - 1; i += 2) {
      if (range[i] == x && range[i+1] == y) {
        return true
      }
    }
    return false
  }

  move(x, y) {
    const range = this.getRange()
    if (!this.isValidMove(x, y, range)) {
      console.log(`${x},${y},${yIndex},${xIndex}`)
      console.log(range)
      console.log("Invalid move. Nothing Done.")
    } else {
      let toDelete = null
      for (piece of allPieces) {
        if (piece.x === x && piece.y === y) {
          toDelete = piece
        }
      }
      if (toDelete !== null) {
        allPieces.splice(allPieces.indexOf(toDelete), 1)
      }
      const oldX = this.x;
      const oldY = this.y;
      this.x = x;
      this.y = y;
      this.buttonNumber = x + y * 8;
      this.draw(oldX, oldY);
      this.hasMoved = true;
    }
  }
}

class KnightObj  {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.buttonNumber = x + y * 8;
    this.name = "knight";
    this.color = color;
  }

  draw() {
    $("button").eq(this.buttonNumber).text(this.color+" "+this.name);
  }

  draw(oldX, oldY) {
    $("button").eq(oldX + oldY * 8).text("");
    $("button").eq(this.buttonNumber).text(this.color+" "+this.name);
    $("button").removeClass("highlight")
  }

  getPiece(x, y) {
    piece = null
    for (aPiece of allPieces) {
      if (aPiece.x === x && aPiece.y === y) {
        piece = aPiece
      }
    }
    return piece
  }

  exploreDiagonal(newX, newY, check) {
    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 && check) {
      console.log(this.getPiece(newX, newY))
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

  getRange() {
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

  displayRange() {
    if ($("button").hasClass("highlight")) {
      $("button").removeClass("highlight")
      return
    }
    const range = this.getRange()
    console.log("New Loop")
    for (let coord = 0; coord < range.length; coord += 2) {
      console.log(`${range[coord]} ${range[coord + 1]}`)
      $("button").eq(range[coord] + 8 * range[coord + 1]).toggleClass("highlight")
    }
  }

  isValidMove(x, y, range) {
    const rangeLength = range.length
    for (let i = 0; i < rangeLength - 1; i += 2) {
      if (range[i] == x && range[i+1] == y) {
        return true
      }
    }
    return false
  }

  move(x, y) {
    const range = this.getRange()
    if (!this.isValidMove(x, y, range)) {
      console.log(`${x},${y},${yIndex},${xIndex}`)
      console.log(range)
      console.log("Invalid move. Nothing Done.")
    } else {
      let toDelete = null
      for (piece of allPieces) {
        if (piece.x === x && piece.y === y) {
          toDelete = piece
        }
      }
      if (toDelete !== null) {
        allPieces.splice(allPieces.indexOf(toDelete), 1)
      }
      const oldX = this.x;
      const oldY = this.y;
      this.x = x;
      this.y = y;
      this.buttonNumber = x + y * 8;
      this.draw(oldX, oldY);
      this.hasMoved = true;
    }
  }
}

// Beginning of setting environment for game

for (let row = 0; row < 8; row++) {
  if (row > 1 && row < 6) {
    continue
  }
  let color = "white"
  for (let col = 0; col < 8; col++) {
    if (row < 2) {
      color = "black"
    }
    if (row === 1) {
      allPieces.push(new PawnObj(col, row, color))
    } else if (row === 6) {
      allPieces.push(new PawnObj(col, row, color))
    } else if (col === 2 || col === 5) {
      allPieces.push(new BishopObj(col, row, color))
    }  else if (col === 0 || col === 7) {
      allPieces.push(new RookObj(col, row, color))
    }  else if (col == 4) {
      allPieces.push(new QueenObj(col, row, color))
    } else if (col == 1 || col == 6) {
      allPieces.push(new KnightObj(col, row, color))
    }
  }
}
for (piece of allPieces) {
  piece.draw()
}

let currentPiece = null

// Respond to click to show moves
$("button").click(function () {
  const index = $("button").index(this)
  let piece = null
  for (aPiece of allPieces) {
    if (aPiece.buttonNumber === index) {
      piece = aPiece
    }
  }
  if ($(this).hasClass("highlight")) {
    currentPiece.move(index % 8, Math.floor(index / 8))
  } else if (piece != null) {
    piece.displayRange()
    currentPiece = piece
  } else {
    $("button").removeClass("highlight")
  }
})
