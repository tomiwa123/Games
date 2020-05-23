// Initialize the background colors for the board
for (let i = 0; i < 64; i++) {
    if (Math.floor(i / 8) % 2 == 0 && i % 2 == 0 || Math.floor(i / 8) % 2 != 0 && i % 2 != 0) {
      $("button").eq(i).css("background-color", "#e0ae2d")
    } else {
      $("button").eq(i).css("background-color", "#7a4a17")
    }
}

pawn = "<image src=\"pawn.png\" width=\"50\" height=\"50\"></image>"

// $("button").eq(0).html("pawn")

class pawnObj  {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.buttonNumber = x + y * 8;
    this.name = "pawn";
    this.color = color;
    this.direction = (color === "white") ? -1 : 1
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
    return [this.x, this.y + this.direction,
                  this.x, this.y + 2 * this.direction]
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
      const oldX = this.x;
      const oldY = this.y;
      this.x = x;
      this.y = y;
      this.buttonNumber = x + y * 8;
      this.draw(oldX, oldY);
    }
  }

}

// Beginning of setting environment for game

const board = new Array(8)
for (let row = 0; row < 8; row++) {
  board[row] = new Array(8);
  for (let col = 0; col < 8; col++) {
    if (row === 1) {
      board[row][col] = new pawnObj(col, row, "black")
      board[row][col].draw()
    } else if (row === 6) {
      board[row][col] = new pawnObj(col, row, "white")
      board[row][col].draw()
    } else {
      board[row][col] = null
    }
  }
}

let currentPiece = null

// Respond to click to show moves
$("button").click(function () {
  const index = $("button").index(this)
  const y = Math.floor(index / 8)
  const x = index % 8
  const piece = board[y][x]
  if (piece != null) {
    piece.displayRange()
    currentPiece = piece
  } else if ($(this).hasClass("highlight")) {
    board[currentPiece.y][currentPiece.x] = null
    currentPiece.move(x, y)
    board[y][x] = currentPiece
    console.log(board)
  } else {
    $("button").removeClass("highlight")
  }
})
