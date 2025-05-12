export const phoneInput = document.getElementById('phone');
phoneInput.value = ' ';

const maskOptions = {
  mask: '+{375} (00) 000-00-00',
  lazy: false
};
export const mask = IMask(phoneInput, maskOptions);