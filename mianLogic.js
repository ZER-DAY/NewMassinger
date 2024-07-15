const baseUrl = "https://tarmeezacademy.com/api/v1"

//================== setup UI==========================///
function setUpUi(){
    const token = localStorage.getItem("token");
    const divloginbtun = document.getElementById("butonsup-div");
    const divlogout = document.getElementById("log-out-div");
    const addPost = document.getElementById("addButn");
    // const usernamenav = document.getElementById("username-nav");
    // the user is guest (not logged in)
    if(token == null){
        if(addPost != null){
            addPost.style.setProperty("display","none","important")
        }
        divloginbtun.style.setProperty("display", "flex", "important");
        divlogout.style.setProperty("display" ,"none", "important");
        
    }else{ // for loged in user 
        divloginbtun.style.setProperty("display", "none", "important");
        divlogout.style.setProperty("display" ,"flex", "important");
        if(addPost != null){
            addPost.style.setProperty("display","none","important")
        }
        const user = getCurrentUser() // to get f
        document.getElementById("username-nav").innerHTML = user.username
        const imgUser = `${user.profile_image}` 
        document.getElementById("imguser").src = imgUser
    }
}
//================== //setup UI// ==========================///




/// ========= auth User========= //////
function loginBtnClicked() {
    const userName = document.getElementById("username-input").value;
    const password = document.getElementById("Password-input").value;
    const params = { 
        "username": userName, 
        "password": password 
    };

    axios.post(`${baseUrl}/login`, params)
        .then(response => {
            const { token, user } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // Hide the modal
            const modalElement = document.getElementById("exampleModal");
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();

            showAlert("Login successfuly", "success");
            setUpUi();
        })
        .catch(error => {
            console.error("Error during login:", error);
            alert("Login failed. Please check your credentials.");
        });
}

function regesterBtunClicked() {
    
    const name = document.getElementById("registerName-input").value;
    const username = document.getElementById("registerUsername-input").value;
    const password = document.getElementById("registerPassword-input").value;
    const poto = document.getElementById("registerImg-input").files[0]

    // إعداد البيانات للإرسال
    let formData =  new FormData()
    formData.append("username",username)
    formData.append("password",password)
    formData.append("name",name)
    formData.append("image",poto)


    const headers = {
        "Content-Type": "multipart/form-data",
    }
    const url = `${baseUrl}/register`;
    axios.post(url, formData ,{
        headers : headers
    } )
        .then(response => {
            console.log("Registration response:", response); // طباعة استجابة السيرفر

            const token = response.data.token; // Assuming the token is in response.data.token
            const user = response.data.user; // Assuming the user data is in response.data.user

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            const modalElement = document.getElementById("regestermodel");
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();


            console.log("Modal hidden successfully");

            showAlert("New user registered successfully" , "success");
            setUpUi();
            
        })
        .catch(error => {
            console.error("Error during registration:", error.response.data); // طباعة خطأ الاستجابة من السيرفر
            // عرض رسالة الخطأ للمستخدم
            const errorMessage = error.response.data.message || "Registration failed. Please check your inputs.";
            showAlert(errorMessage , "warning")
        });
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showAlert("Logged out successfuly");
    setUpUi();
}

function showAlert(customMessage , type="success"){
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')
    
    alertPlaceholder.append(wrapper)
    }
    appendAlert(customMessage , type)

    setTimeout(() =>{
        const alertTohide = bootstrap.Alert.getOrCreateInstance('#success-alert')
        alertInstance.close();
    },2000)
}

//to get the Username 
function getCurrentUser(){
    let user = null
    const storageUser  = localStorage.getItem("user")
    user = JSON.parse(storageUser)

    if(storageUser != null){
        user = JSON.parse(storageUser)
    }
    return user
}

/// ========= //auth User// ========= //////
