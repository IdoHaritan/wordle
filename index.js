const hash = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

const get_word = async () => {
  const response = await fetch("words.txt");
  const text = await response.text();
  const normalizedText = text.replace(/\r\n/g, '\n');
  const words = normalizedText.split('\n');

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  return [
    words,
    words[hash(currentDate.getTime().toString()) % words.length].toUpperCase(),
  ];
};

const update_guess = (index, char = "") => {
  user_guess[index] = char;
  console.log(user_guess.join(""));
  console.log(todays_word);
};

const does_word_exist = () => {
  const user_word = user_guess.join("").toLowerCase();

  if (user_word.length < 5 || !words.includes(user_word)) {
    return false;
  }

  return true;
};

const is_letter_included = (char, index, todays_word) => {
  const other_index = todays_word.indexOf(char)
  if (index == other_index) {
    return 1; // Green
  } else if (other_index == -1) {
    return 0; // Grey
  } else {
    return 2; // Yellow
  }
}

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

          const user_word = user_guess.join("");

          if (!input.value) {
            return;
          }

          if (!does_word_exist()) {
            return;
          }

          const colors = {
            0: "gray",
            1: "green",
            2: "yellow"
          };

          [...user_word].forEach((char, index) => {
            inputs[index].classList.add(colors[is_letter_included(char, index, todays_word)])
          })

          if (user_word == todays_word) {
            alert("Guessed correctly!");
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

const user_guess = [];
const output = await get_word();
const words = output[0];
const todays_word = output[1];
