

for (let i = 0; i < 64; i++) {
    if (Math.floor(i / 8) % 2 == 0 && i % 2 == 0 || Math.floor(i / 8) % 2 != 0 && i % 2 != 0) {
      $("button").eq(i).css("background-color", "black")
    } else {
      $("button").eq(i).css("background-color", "white")
    }

}
