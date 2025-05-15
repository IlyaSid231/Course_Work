function addDarkClassToHTML(){
    try {
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark');
        }
        else{
            document.documentElement.classList.remove('dark');
        }
    } catch (err) { }
    
}
addDarkClassToHTML();