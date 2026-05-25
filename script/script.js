const API = "http://localhost:3000/tasks"

let editingId = 0

const loggedInUser =
JSON.parse(localStorage.getItem("loggedInUser"));


async function addTask(){

    const input =
    document.getElementById('taskInput')

    const desInput =
    document.getElementById('taskDescription')

    const value = input.value.trim()

    const desValue = desInput.value.trim()

     const date =
    document.getElementById('taskDate').value

    const priority =
    document.getElementById('taskPriority').value

    try{

        await fetch(API,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                title:value,
                description:desValue,
                dueDate:date,
                priority:priority,
                createdAt: new Date().toLocaleDateString(),
                userId: loggedInUser.id,
                isDeleted: false

            })

        })

        input.value = ""
        desInput.value = ""


        fetchTasks()

    }catch(error){

        console.log(error)

    }

}



async function fetchTasks(){

    try{

        const response =
        await fetch(API)

      const tasks = await response.json();

     const userTasks =
tasks.filter(task =>

task.userId === loggedInUser.id &&
task.isDeleted === false

);
        const container =
        document.getElementById('taskContainer')

        
        container.innerHTML = ""


        userTasks.forEach(task => {

            container.innerHTML += `

            <div class="col-md-4 col-12">

                <div class="card p-3 shadow-lg border-0 h-100">

                    <span class="badge bg-primary w-25 mb-3">
                        ${task.priority}
                    </span>

                    <h5 class="card-title fw-bold">
                        ${task.title}
                    </h5>

                    <p class="card-text text-secondary">
                        ${task.description}
                    </p>

                       <p class="card-text text-secondary">
                        Due Date: ${task.dueDate}
                    </p>
  <p class="card-text text-secondary">
                       Created At: ${task.createdAt}
                    </p>

                    <div class="d-flex gap-3">

                        <button
                            class="btn btn-dark mt-2 w-50"
                            data-bs-toggle="modal"
                            data-bs-target="#taskModalUpdate"
                            onclick="editTask('${task.id}')"
                        >

                            Update

                        </button>


                        <button
                            class="btn btn-danger mt-2 w-50" onclick="deleteTask('${task.id}')"
                        >

                            Delete

                        </button>

                    </div>

                </div>

            </div>

            `

        })

    }catch(error){

        console.log(error)

    }

}



async function editTask(id){

    try{

    editingId = id

    const update =
    document.getElementById('updateValue')

    const updateDescription =
    document.getElementById('updateDescription')

    const UpdatetaskDate=document.getElementById('UpdatetaskDate')
        const updateStatus =
document.getElementById('updateStatus')

    const response =
    await fetch(`${API}/${id}`)

    const task =
    await response.json()

    update.value = task.title

    updateDescription.value =
    task.description

    UpdatetaskDate.value = task.dueDate

      updateStatus.value = task.priority
    } catch(error){
        console.log(error)
    }

}

async function deleteTask(id){

    try{

        await fetch(`${API}/${id}`,{

            method:"PATCH",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                isDeleted:true

            })

        })

        fetchTasks()

    }catch(err){

        console.log(err)

    }

}


async function updateTask(id){
    const update =document.getElementById('updateValue')
    const updateValue=update.value.trim()

    const updateDes=document.getElementById('updateDescription')
    const updateDescription=updateDes.value.trim()

    const UpdatetaskDate=document.getElementById('UpdatetaskDate').value
    const updateStatus =
document.getElementById('updateStatus').value

    try{
      
        await fetch(`${API}/${id}`, {

            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: updateValue,
                description:updateDescription,
                dueDate:UpdatetaskDate,
                priority:updateStatus
            })
        });
          currentEditId = null;
          fetchTasks()
    }catch(err){
    console.log(err)
    }
}

const updateButton=document.getElementById('update')
updateButton.addEventListener('click',()=>{
    updateTask(editingId)
})

async function filterTasks(status){

    try{

        const response =
        await fetch(API)

        const tasks =
        await response.json()

  const filteredTasks =
tasks.filter(task =>

    task.priority === status &&
    task.userId === loggedInUser.id &&
    task.isDeleted === false

)

        const container =
        document.getElementById('taskContainer')

        container.innerHTML = ""

        filteredTasks.forEach(task => {

            container.innerHTML += `

            <div class="col-md-4 col-12">

                <div class="card p-3 shadow-lg border-0 h-100">

                    <span class="badge bg-primary w-25 mb-3">
                        ${task.priority}
                    </span>

                    <h5 class="card-title fw-bold">
                        ${task.title}
                    </h5>

                    <p class="card-text text-secondary">
                        ${task.description}
                    </p>

                    <p class="card-text text-secondary">
                        Due Date: ${task.dueDate}
                    </p>

                    <p class="card-text text-secondary">
                        Created At: ${task.createdAt}
                    </p>

                    <div class="d-flex gap-3">

                        <button
                            class="btn btn-dark mt-2 w-50"
                            data-bs-toggle="modal"
                            data-bs-target="#taskModalUpdate"
                            onclick="editTask('${task.id}')"
                        >
                            Update
                        </button>

                        <button
                            class="btn btn-danger mt-2 w-50"
                            onclick="deleteTask('${task.id}')"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            </div>

            `
        })

    }catch(error){

        console.log(error)

    }

}
async function fetchDeletedTasks(){

    const response = await fetch(API)

    const tasks = await response.json()

    const deletedTasks =
    tasks.filter(task =>

        task.userId === loggedInUser.id &&
        task.isDeleted === true

    )
    const container =
        document.getElementById('taskContainer')

        
        container.innerHTML = ""


        deletedTasks.forEach(task => {

            container.innerHTML += `

            <div class="col-md-4 col-12">

                <div class="card p-3 shadow-lg border-0 h-100">

                    <span class="badge bg-primary w-25 mb-3">
                        ${task.priority}
                    </span>

                    <h5 class="card-title fw-bold">
                        ${task.title}
                    </h5>

                    <p class="card-text text-secondary">
                        ${task.description}
                    </p>

                       <p class="card-text text-secondary">
                        Due Date: ${task.dueDate}
                    </p>
  <p class="card-text text-secondary">
                       Created At: ${task.createdAt}
                    </p>

                    <div class="d-flex gap-3">

                        <button
                            class="btn btn-danger mt-2 w-50"
                            onclick="restoreTask('${task.id}')"
                        >

                            Restore

                        </button>


              
                    </div>

                </div>

            </div>

            `

        })
         console.log(deletedTasks)

    }

    async function fetchOverDueTasks(){

    try{

        const response = await fetch(API)

        const tasks = await response.json()

        const today = new Date()

        const overDueTasks = tasks.filter(task =>

            task.userId === loggedInUser.id &&
            task.isDeleted === false &&
            new Date(task.dueDate) < today

        )

        const container =
        document.getElementById('taskContainer')

        container.innerHTML = ""

        overDueTasks.forEach(task => {

            container.innerHTML += `

            <div class="col-md-4 col-12">

                <div class="card p-3 shadow-lg border-0 h-100">

                    <span class="badge bg-danger w-25 mb-3">
                        Overdue
                    </span>

                    <h5 class="card-title fw-bold">
                        ${task.title}
                    </h5>

                    <p class="card-text text-secondary">
                        ${task.description}
                    </p>

                    <p class="card-text text-danger fw-bold">
                        Due Date: ${task.dueDate}
                    </p>

                    <p class="card-text text-secondary">
                        Created At: ${task.createdAt}
                    </p>

                </div>

            </div>

            `

        })

    }catch(error){

        console.log(error)

    }

}

async function restoreTask(id){

    try{

        await fetch(`${API}/${id}`,{

            method:"PATCH",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                isDeleted:false

            })

        })

        fetchTasks()

    }catch(error){

        console.log(error)

    }

}

fetchTasks()

 const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;


function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-bs-theme', 'light');
      
        body.classList.replace('bg-black', 'bg-light');
        themeIcon.innerText = '☀️'; 
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        body.classList.replace('bg-light', 'bg-black');
        themeIcon.innerText = '🌙';
    }
 
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
});


window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
});



window.addEventListener('DOMContentLoaded', () => {

    const savedTheme =
    localStorage.getItem('theme') || 'dark';

    applyTheme(savedTheme);

    if (loggedInUser) {

        // Navbar name
        document.getElementById('navUsername').innerText =
        loggedInUser.username || "User";

        // Offcanvas heading
        document.getElementById('dropdownUsername').innerText =
        loggedInUser.username || "User";

        // Profile Details
        document.getElementById('profileUsername').innerText =
        loggedInUser.username || "N/A";

        document.getElementById('profileEmail').innerText =
        loggedInUser.email || "N/A";

        document.getElementById('profilePhone').innerText =
        loggedInUser.phone || "N/A";

        document.getElementById('profileDob').innerText =
        loggedInUser.dob || "N/A";

        document.getElementById('profileGender').innerText =
        loggedInUser.gender || "N/A";

        document.getElementById('profileAddress').innerText =
        loggedInUser.address || "N/A";

    }

});


document.addEventListener('click', (e) => {
    
    if (e.target && (e.target.id === 'logoutBtn' || e.target.id === 'logout')) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
});