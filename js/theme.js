var checkBox_1 = document.querySelector(".switch");

checkBox_1.addEventListener("change", function(){
    if (localStorage.getItem('theme') === 'dark') {
        localStorage.removeItem('theme');
    }
    else{
        localStorage.setItem('theme', 'dark');
    }
    addDarkClassToHTML();
});

function addDarkClassToHTML(){
    try {
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark');
            document.querySelector(".switch input").checked = true;
            document.getElementById("header_favorite_button").style.filter = "brightness(5)";
            document.getElementById("header_request_button").style.filter = "brightness(5)";
            document.getElementById("header_user_button").style.filter = "brightness(5)";
            document.getElementById("blind_version_btn").style.filter = "brightness(5)";
            document.getElementById("header_logo_image").style.filter = "brightness(4)";
            document.getElementById("footer_logo_image").style.filter = "brightness(4)";
            const selectArrows = document.querySelectorAll(".filter_dropdown img");
            if(selectArrows){
                selectArrows.forEach(arrow => 
                    arrow.style.filter = "brightness(4)"                    
                )
            }
            
        }
        else{
            document.documentElement.classList.remove('dark');
            document.querySelector(".switch input").checked = false;
            document.getElementById("header_favorite_button").style.filter = "brightness(1)";
            document.getElementById("header_request_button").style.filter = "brightness(1)";
            document.getElementById("header_user_button").style.filter = "brightness(1)";
            document.getElementById("blind_version_btn").style.filter = "brightness(1)";
            document.getElementById("header_logo_image").style.filter = "brightness(1)";
            document.getElementById("footer_logo_image").style.filter = "brightness(1)";
            const selectArrows = document.querySelectorAll(".filter_dropdown img");
            if(selectArrows){
                selectArrows.forEach(arrow => 
                    arrow.style.filter = "brightness(1)"                    
                )
            }
        }
    } catch (err) { }
    
}

addDarkClassToHTML();