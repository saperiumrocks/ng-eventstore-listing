export const Helpers = {
  generateToken: () => {
    return Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString();
  }
}
