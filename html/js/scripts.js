function randombg() {
  let bigSize = ["url('../images/background1-min.jpeg')", "url('../images/background2-min.jpeg')", "url('../images/background3-min.jpeg')", "url('../images/background4-min.jpeg')"];
  let randomPic = Math.floor(Math.random() * 4) + 0;
  $("#random").css('background-image',bigSize[randomPic]);
}
