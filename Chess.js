// Initialize the background colors for the board
for (let i = 0; i < 64; i++) {
    if (Math.floor(i / 8) % 2 == 0 && i % 2 == 0 || Math.floor(i / 8) % 2 != 0 && i % 2 != 0) {
      $("button").eq(i).css("background-color", "#e0ae2d")
    } else {
      $("button").eq(i).css("background-color", "#7a4a17")
    }
}

pawn = "<image src=\"pawn.png\" width=\"50\" height=\"50\"></image>"

$("button").eq(0).html("pawn")
