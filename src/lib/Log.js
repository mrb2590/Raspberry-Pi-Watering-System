class Log {
  constructor () {
    this.tableOut = false;
    this.lines = [];
    this.largestKey = 11;
    this.largestValue = 11;
  }

  writeStdOut (data) {
    this.lines = [];
    this.largestKey = 11;
    this.largestValue = 11;

    // Get column widths
    data.forEach(row => {
      let key = row.key.toString();
      let value = row.value.toString();

      if (key.length > this.largestKey) {
        this.largestKey = key.length;
      }

      if (value.length > this.largestValue) {
        this.largestValue = value.length;
      }
    });

    // Build rows
    data.forEach((row) => {
      let key = row.key.toString();
      let value = row.value.toString();

      let line = `| ${key}`;
  
      for (let i = 0; i < this.largestKey - key.length + 2; i++) {
        line += ' ';
      }

      line += `| ${value}`;

      for (let i = 0; i < this.largestValue - value.length + 1; i++) {
        line += ' ';
      }

      line += '|';

      this.lines.push(line);
    });

    // Add heading
    let rowLength = this.largestKey + this.largestValue + 8;

    for (let i = 0; i < 3; i++) {
      let line = '';

      if (i === 0 || i === 2) {
        for (let j = 0; j < rowLength; j++) {
          if (j === 0 || j === rowLength - 1) {
            line += i === 0 ? '|' : ' ';
          } else {
            line += '-';
          }
        }
      } else if (i === 1) {
        line += '| Watering System';

        let currentLength = line.length;

        for (let j = 0; j < rowLength - currentLength - 1; j++) {
          line += ' ';
        }

        line += '|';
      }

      this.lines.unshift(line);
    }

    // Add bottom table border
    let line = '';

    for (let i = 0; i < rowLength; i++) {
      if (i === 0 || i === rowLength - 1) {
        line += ' ';
      } else {
        line += '-';
      }
    }

    this.lines.push(line);

    // Clear current table output
    if (this.tableOut) {
      this.clearConsole();
    } else {
      this.tableOut = true;
    }

    // Write table
    this.lines.forEach(line => {
      process.stdout.write(`${line}\n`);
    });
  }

  clearConsole () {
    for (let i = 0; i < this.lines.length; i++) {
      process.stdout.cursorTo(0, process.stdout.rows - 2 - i);
      process.stdout.clearLine();
    }
  }
}

module.exports = Log;
