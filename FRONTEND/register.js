document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("registerForm");
    const message = document.getElementById("message");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    togglePassword.addEventListener("click", () => {

        if(passwordInput.type==="password"){
            passwordInput.type="text";
            togglePassword.textContent="🙈";
        }else{
            passwordInput.type="password";
            togglePassword.textContent="👁";
        }

    });

    registerForm.addEventListener("submit", async(e)=>{

        e.preventDefault();

        const name=document.getElementById("name").value.trim();
        const email=document.getElementById("email").value.trim();
        const password=passwordInput.value.trim();

        try{

            const response=await fetch("http://localhost:5000/api/users/register",{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    name,
                    email,
                    password
                })

            });

            const data=await response.json();

            if(response.ok){

                message.style.color="green";
                message.textContent="✅ Registration Successful";

                setTimeout(()=>{

                    window.location.href="login.html";

                },1500);

            }else{

                message.style.color="red";
                message.textContent=data.message;

            }

        }catch(error){

            console.error(error);

            message.style.color="red";
            message.textContent="Unable to connect to the server.";

        }

    });

});