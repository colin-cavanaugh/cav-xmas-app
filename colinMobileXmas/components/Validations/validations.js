export function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_\-.$#@]+[0-9]+[a-zA-Z0-9_\-.$#@]*$/
  return usernameRegex.test(username)
}

export function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!$#%-])[a-zA-Z0-9!$#%-]{8,}$/
  return passwordRegex.test(password)
}
