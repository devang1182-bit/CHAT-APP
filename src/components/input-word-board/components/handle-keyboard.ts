interface HandleKeyboardParams {
  event: KeyboardEvent;
  isChecking: boolean;

  handleSubmit: () => void;

  handleBackspace: () => void;

  handleLetter: (letter: string) => void;
}

export const handleKeyboard = ({
  event,
  isChecking,
  handleSubmit,
  handleBackspace,
  handleLetter,
}: HandleKeyboardParams) => {

  if (isChecking) {
    return;
  }


  if (event.key === "Enter") {
    handleSubmit();
    return;
  }


  if (event.key === "Backspace") {
    handleBackspace();
    return;
  }


  if (/^[a-zA-Z]$/.test(event.key)) {
    handleLetter(event.key);
  }
};