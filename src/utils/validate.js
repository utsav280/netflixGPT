export const checkValidateData = (email, password) => {
  const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(
    email
  );
  const isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(
    password
  );
  if (!isEmailValid) {
    return { isValid: false, message: "Email is not valid" };
  }
  if (!isPasswordValid) {
    return { isValid: false, message: "Password is not valid" };
  }
  return { isValid: true, message: "" };
};
