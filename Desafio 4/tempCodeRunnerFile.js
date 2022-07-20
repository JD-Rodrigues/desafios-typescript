let str = '#';
while (str.length < 7) {
  str += Math.floor(Math.random() * 0x10).toString(16);
}