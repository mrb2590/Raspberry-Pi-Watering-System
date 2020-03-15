


poo = 1
doo =2


setInterval(() => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0, process.stdout.rows - 2);
  process.stdout.clearLine();
  process.stdout.write('poo: '+(poo++)+'\n')
  process.stdout.write('do: '+doo++)
}, 1000)
// console.log(process.stdout)
// console.log(process.stdout.rows)