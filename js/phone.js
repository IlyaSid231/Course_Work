export const addPhone = document.getElementById('add-phone');
export const editPhone = document.getElementById('edit-phone');
addPhone.value = ' ';
editPhone.value = ' ';

const maskOptions = {
  mask: '+{375} (00) 000-00-00',
  lazy: false
};
export const addMask = IMask(addPhone, maskOptions);
export const editMask = IMask(editPhone, maskOptions);
