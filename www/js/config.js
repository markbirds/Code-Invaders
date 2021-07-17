// game configurations
var config = {
  general: {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  },
  game: {
    backgroundWidth: 256,
    backgroundHeight: 608,
    cloudWidth: 256,
    cloudHeight: 103,
    get backgroundRatio() {
      return this.backgroundHeight / this.backgroundWidth;
    },
    get cloudRatio() {
      return this.cloudHeight / this.cloudWidth;
    },
  },
};

// sets screen to phone like if width > height (like running in laptops)
if (window.innerWidth >= window.innerHeight) {
  config.general.windowWidth = (window.innerHeight * 3) / 5;
}

// styles for embedding html components
config["styles"] = {
  container: [
    "width:" +
      +(config.general.windowWidth - config.general.windowWidth * 0.2) +
      "px",
    "height:" +
      +(config.general.windowHeight - config.general.windowHeight * 0.15) +
      "px",
  ].join(";"),
  pause: [
    "width:" +
      +(config.general.windowWidth - config.general.windowWidth * 0.2) +
      "px",
    "height:" +
      +(config.general.windowHeight - config.general.windowHeight * 0.3) +
      "px",
  ].join(";"),
  debugging: [
    "width:" +
      +(config.general.windowWidth - config.general.windowWidth * 0.2) +
      "px",
    "height:" +
      +(config.general.windowHeight - config.general.windowHeight * 0.3) +
      "px",
  ].join(";"),
  gameOver: [
    "width:" +
      +(config.general.windowWidth - config.general.windowWidth * 0.2) +
      "px",
  ].join(";"),
};

// different debugging questions based on topic
var debugging = {
  "input-output": {
    "cpp-sprite": [
      {
        error: 'error: missing terminating " character',
        src: "assets/images/debugging/input-output/cpp/0.png",
        answer: "8",
      },
      {
        error: "error: no match for ‘operator<<’",
        src: "assets/images/debugging/input-output/cpp/1.png",
        answer: "12",
      },
      {
        error: "error: ‘nam’ was not declared in this scope",
        src: "assets/images/debugging/input-output/cpp/2.png",
        answer: "9",
      },
    ],
    "java-sprite": [
      {
        error: "error: unclosed string literal",
        src: "assets/images/debugging/input-output/java/0.png",
        answer: "7",
      },
      {
        error: "error: not a statement",
        src: "assets/images/debugging/input-output/java/1.png",
        answer: "9",
      },
      {
        error: "error: cannot find symbol",
        src: "assets/images/debugging/input-output/java/2.png",
        answer: "4",
      },
    ],
    "python-sprite": [
      {
        error: "SyntaxError: EOL while scanning string literal",
        src: "assets/images/debugging/input-output/python/0.png",
        answer: "2",
      },
      {
        error: "NameError: name 'prin' is not defined",
        src: "assets/images/debugging/input-output/python/1.png",
        answer: "4",
      },
      {
        error: "SyntaxError: invalid syntax",
        src: "assets/images/debugging/input-output/python/2.png",
        answer: "1",
      },
    ],
  },
  variables: {
    "cpp-sprite": [
      {
        error:
          "error: invalid conversion from ‘const char*’ to ‘int’ [-fpermissive]",
        src: "assets/images/debugging/variables/cpp/0.png",
        answer: "7",
      },
      {
        error: "error: ‘b’ was not declared in this scope",
        src: "assets/images/debugging/variables/cpp/1.png",
        answer: "6",
      },
      {
        error: "error: expected initializer before ‘==’ token",
        src: "assets/images/debugging/variables/cpp/2.png",
        answer: "5",
      },
    ],
    "java-sprite": [
      {
        error: "error: incompatible types: String cannot be converted to int",
        src: "assets/images/debugging/variables/java/0.png",
        answer: "5",
      },
      {
        error: "error: cannot find symbol",
        src: "assets/images/debugging/variables/java/1.png",
        answer: "4",
      },
      {
        error: "error: ';' expected",
        src: "assets/images/debugging/variables/java/2.png",
        answer: "3",
      },
    ],
    "python-sprite": [
      {
        error: "SyntaxError: can't assign to operator",
        src: "assets/images/debugging/variables/python/0.png",
        answer: "2",
      },
      {
        error: "ValueError: too many values to unpack (expected 2)",
        src: "assets/images/debugging/variables/python/1.png",
        answer: "1",
      },
      {
        error: "TypeError: unsupported operand type(s) for +: 'int' and 'str'",
        src: "assets/images/debugging/variables/python/2.png",
        answer: "3",
      },
    ],
  },
  "if-statements": {
    "cpp-sprite": [
      {
        error: "error: expected ‘}’ before ‘else’",
        src: "assets/images/debugging/if-statements/cpp/0.png",
        answer: "9",
      },
      {
        error: "error: expected primary-expression before ‘=’ token",
        src: "assets/images/debugging/if-statements/cpp/1.png",
        answer: "7",
      },
      {
        error: "error: ‘else’ without a previous ‘if’",
        src: "assets/images/debugging/if-statements/cpp/2.png",
        answer: "7",
      },
    ],
    "java-sprite": [
      {
        error: "error: 'else' without 'if'",
        src: "assets/images/debugging/if-statements/java/0.png",
        answer: "7",
      },
      {
        error: "error: incompatible types: int cannot be converted to boolean",
        src: "assets/images/debugging/if-statements/java/1.png",
        answer: "5",
      },
      {
        error: "error: 'else' without 'if'",
        src: "assets/images/debugging/if-statements/java/2.png",
        answer: "5",
      },
    ],
    "python-sprite": [
      {
        error: "IndentationError: expected an indented block",
        src: "assets/images/debugging/if-statements/python/0.png",
        answer: "4",
      },
      {
        error: "SyntaxError: invalid syntax",
        src: "assets/images/debugging/if-statements/python/1.png",
        answer: "4",
      },
      {
        error: "SyntaxError: invalid syntax",
        src: "assets/images/debugging/if-statements/python/2.png",
        answer: "3",
      },
    ],
  },
};
