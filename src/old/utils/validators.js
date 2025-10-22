// Validators utility
export const isEmail = (email) => /\S+@\S+\.\S+/.test(email)
export const isNotEmpty = (value) => value && value.trim() !== ''
// Add more validators as needed
