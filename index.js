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
      input.addEventListener("input", function (event) {
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
      });

      input.addEventListener("keydown", function (event) {
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
          }
        }
      });
    });
  });
});
