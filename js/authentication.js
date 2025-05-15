
// Функция для получения текущего userName
export function getCurrentUserName() {
  let currentUserName = localStorage.getItem("currentUserName");
  if (currentUserName) {
    return currentUserName;
  }
  else {
    localStorage.setItem("currentUserName", "unauthorized")
    return "unauthorized";
    return "adminMe";
  }
}
