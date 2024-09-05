const hash = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

const user_guess = [];
const words = (await (await fetch("words.txt")).text()).split("\n");
console.log(words.length);
console.log(typeof words);

const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

const todays_word =
  words[hash(currentDate.getTime().toString()) % words.length];
console.log(todays_word);

const update_guess = (index, char = "") => {
  user_guess[index] = char;
  console.log(user_guess);
  console.log(user_guess.join(""));
};

document.addEventListener("DOMContentLoaded", function () {
  const guessLines = document.querySelectorAll(".guess");
  const allInputs = document.querySelectorAll(".char");

  allInputs.forEach((input) => {
    input.disabled = true;
  });

  const firstLine = guessLines[0].querySelectorAll(".char");
  firstLine.forEach((input) => {
    input.disabled = false;
  });
  firstLine[0].focus();

  guessLines.forEach((line, lineIndex) => {
    const inputs = line.querySelectorAll(".char");

    inputs.forEach((input, inputIndex) => {
      input.addEventListener("input", (event) => {
        const value = input.value;

        if (!/^[a-zA-Z]$/.test(value)) {
          input.value = "";
          return;
        } else {
          input.value = value.toUpperCase();
        }

        if (inputIndex < inputs.length - 1) {
          inputs[inputIndex + 1].focus();
        }

        update_guess(inputIndex, input.value);
      });

      input.addEventListener("keydown", (event) => {
        if (event.key === "Backspace" && inputIndex > 0) {
          if (input.value) {
            update_guess(inputIndex);
          } else {
            update_guess(inputIndex - 1);
          }
        }

        if (event.key === "Backspace" && !input.value && inputIndex > 0) {
          inputs[inputIndex - 1].focus();
        }

        if (event.key === "Enter" && inputIndex === inputs.length - 1) {
          event.preventDefault();

          if (!input.value) {
            return;
          }

          if (lineIndex < guessLines.length - 1) {
            inputs.forEach((inp) => (inp.disabled = true));
            const nextLine =
              guessLines[lineIndex + 1].querySelectorAll(".char");
            nextLine.forEach((inp) => (inp.disabled = false));
            nextLine[0].focus();
          } else {
            inputs.forEach((inp) => (inp.disabled = true));
            alert("GAME OVER");
          }

          user_guess.length = 0;
        }
      });
    });
  });
});
