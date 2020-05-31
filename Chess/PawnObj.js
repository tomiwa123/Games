export const food = "beans";

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
