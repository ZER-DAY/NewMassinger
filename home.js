;
let currentPage = 1
let lastPage = 1



window.addEventListener("scroll", function() {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 1;
    if (endOfPage && endOfPage < lastPage) {
        currentPage = currentPage + 1
        getPosts(false , currentPage ) 
        
    }
});

//// =========//INFINET SCROOL//=========///



setUpUi();
getPosts();

function getPosts(reload = true, page = 1) {
    axios.get(`${baseUrl}/posts?limit=4&page=${page}`)
        .then(response => {
            const posts = response.data.data;
            console.log("The response is", response);
            const postsContainer = document.getElementById("Posts");
            lastPage = response.data.meta.last_page
        
            if(reload){
                postsContainer.innerHTML = "";
            }
            posts.forEach(post => {
                const author = post.author;
                const postTitle = post.title || ""; // Default to empty string if title is null
                const postId = post.id
                const content = `
                        <div class="card shadow" ">
                            <div class="card-header">
                                <img src="${author.profile_image}" alt="" style="width: 40px;" class="rounded-circle rounded-3" >
                                <b>${author.username}</b>
                                <button class='btn btn-secondary' style='float: right' onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>


                                    </div>
                            </div>
                            <div class="card-body">
                                <img class="w-100" src="${post.image}" alt="" onClick="getPostTags(${post.id})" style="cursor: pointer;>
                                <h6 style="color: rgb(185, 175, 175);" class="mt-1">${post.created_at}</h6>
                                <h5>${postTitle}</h5>
                                <p>${post.body}</p>
                                <hr>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                    </svg>
                                    <span>
                                    ${post.comments_count}
                                    <span id="post-tags-${post.id}">
                                        <!-- Tags will be appended here -->
                                    </span>
                                    </span>
                                </div>
                                
                            </div>
                            
                        </div>
                `;
                postsContainer.innerHTML += content;

                const currentPostTagsId = `post-tags-${post.id}`;
                const tagsContainer = document.getElementById(currentPostTagsId);
                tagsContainer.innerHTML = ""; // تصحيح المعرف
                
                // تحقق من التاجات
                console.log(`Processing tags for post ${post.id}`);
                if (post.tags && post.tags.length > 0) {
                    post.tags.forEach(tag => {
                        console.log(`Tag: ${tag.name}`);
                        let tagContent = `
                            <button class="btn btn-sm rounded-5" style="background-color: gray; color: white;">
                                ${tag.name}
                            </button>
                        `;
                        tagsContainer.innerHTML += tagContent; // تصحيح المعرف
                    });
                } else {
                    console.log(`No tags found for post ${post.id}`);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching posts:", error);
            alert("Failed to load posts. Please try again later.");
        });
}



function getPostTags(postId){
window.location = `postDetiles.html?postId=${postId}`

}


function createNewPost() {

    const title = document.getElementById("posttitle-input").value;
    const body = document.getElementById("PostbodyTitle").value;
    const poto = document.getElementById("postImg-input").files[0]
    const token= localStorage.getItem("token")
    // إعداد البيانات للإرسال
    let formData =  new FormData()
    formData.append("body",body)
    formData.append("title",title)
    formData.append("image",poto)

    // const params = {

    //     "body": body,
    //     "title": title,
    //     "image": poto
    // };

    

    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization" : `Bearer ${token}`
    }

    const url = `${baseUrl}/posts`;
    axios.post(url, formData ,{
        headers : headers
    } )
        .then((response) => {

        console.log(response)
        
        const modalElement = document.getElementById("create-post-model");
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modalInstance.hide();
        showAlert("New Post" , "success");
        getPosts()

        })
        .catch((error) =>{
            const message = error.response.data.message
            showAlert(message , "danger")
        })
}

function editPostBtnClicked(postObject) {
const post = JSON.parse(decodeURIComponent(postObject));
console.log(post);
// document.getElementById("is-edite-post-input").value = true
document.getElementById("postmodelTitel").innerHTML = "Edit Post"
let postModel = new bootstrap.Modal(document.getElementById("create-post-model"), {})
postModel.toggle()

document.getElementById("posttitle-input").value = post.title
document.getElementById("PostbodyTitle").value = post.body

const url= 
axios.post()


}
