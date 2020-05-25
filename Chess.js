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
let currentPiece = null
let previousPiece = null

class GeneralObj {
  constructor(x, y, color, name) {
    this.x = x;
    this.y = y;
    this.buttonNumber = x + y * 8;
    this.name = name;
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

  getPieceByType(name, color) {
    piece = null
    for (aPiece of allPieces) {
      if (aPiece.name === name && aPiece.color === color) {
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
      console.log(`${x},${y}`)
      console.log(range)
      console.log("Invalid move. Nothing Done.")
    } else {
      let toDelete = this.getPiece(x, y)

      if (toDelete === null && this.name === "pawn" &&
          Math.abs(x - this.x) === 1 && y === this.y + this.direction) {
        toDelete = this.getPiece(x, this.y)
        $("button").eq(x + this.y * 8).text("");
      }
      if (toDelete !== null) {
        allPieces.splice(allPieces.indexOf(toDelete), 1)
      }
      const oldX = this.x;
      const oldY = this.y;
      this.x = x;
      this.y = y;
      this.buttonNumber = x + y * 8;

      // Check Error Check
      if (this.getPieceByType("king", this.color).isChecked()) {
        $('button').removeClass("highlight")
        if (toDelete != null) {
          allPieces.push(toDelete)
          toDelete.draw()
        }
        this.x = oldX;
        this.y = oldY;
        this.buttonNumber = oldX + oldY * 8;
        return "Self Check"
      }

      this.draw(oldX, oldY);
      this.hasMoved = true;
    }
  }
}

class PawnObj extends GeneralObj {
  constructor(x, y, color) {
    super(x, y, color, "pawn")
    this.direction = (color === "white") ? -1 : 1;
    this.hasMoved = false;
  }

  getRange() {
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
      if (previousPiece.name === "pawn" && previousPiece.color !== this.color) {
        let rank = this.color === "white" ? 3 : 4;
        if (previousPiece.y === this.y && Math.abs(previousPiece.x - this.x) == 1 &&
            this.y === rank) {
          this.range.push(previousPiece.x)
          this.range.push(previousPiece.y + this.direction)
        }
      }
    }

    return this.range
  }
}

class BishopObj extends GeneralObj  {
  constructor(x, y, color) {
    super(x, y, color, "bishop")
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
}

class RookObj extends GeneralObj  {
  constructor(x, y, color) {
    super (x, y, color, "rook")
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
}

class QueenObj extends GeneralObj {
  constructor(x, y, color) {
    super(x, y, color, "Queen")
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

class KnightObj extends GeneralObj  {
  constructor(x, y, color) {
    super(x, y, color, "knight")
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
}

class KingObj extends GeneralObj {
  constructor(x, y, color) {
    super(x, y, color, "king")
  }

  getRange() {
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

    return this.range
  }

  isChecked() {
    for (piece of allPieces) {
      if (piece.color !== this.color) {
        let range = piece.getRange()
        for (let x = 0; x < range.length - 1; x += 2) {
          if (range[x] === this.x && range[x + 1] === this.y) {
            return true
          }
        }
      }
    }
    return false
  }

  isCheckmated() {
    for (piece of allPieces) {
      if (piece.color === this.color) {
        let range = piece.getRange()
        for (let x = 0; x < range.length - 1; x += 2) {
          if (piece.move(range[x], range[x + 1]) !== undefined) {
            return true
          }
        }
      }
    }
    return false
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
    } else {
      allPieces.push(new KingObj(col, row, color))
    }
  }
}
for (piece of allPieces) {
  piece.draw()
}

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
    if (currentPiece.move(index % 8, Math.floor(index / 8)) !== undefined) {
      alert("Need to perform a move that resolves Check")
    }

  } else if (piece != null) {
    if (piece !== currentPiece) {
      previousPiece = currentPiece
      currentPiece = piece
    }
    piece.displayRange()
  } else {
    $("button").removeClass("highlight")
  }
})
