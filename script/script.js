const API = "http://localhost:3000/tasks"

let editingId = 0

const loggedInUser =
JSON.parse(localStorage.getItem("loggedInUser"));





function getBadgeColorClass(status) {
    switch (String(status).toLowerCase()) {
        case 'completed':
            return 'bg-success';
        case 'pending':
            return 'bg-warning text-dark';
        case 'not started':
            return 'bg-danger';
        default:
            return 'bg-primary';
    }
}


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

    const today = new Date().toISOString().split("T")[0];

if(date < today){

    Swal.fire({
        title: "Invalid Due Date",
        text: "Due date cannot be in the past!",
        icon: "error",
        confirmButtonColor: "#ef4444"
    });

    return;
}

    if (!value || !desValue || !date || !priority) {
        Swal.fire({
            title: "Missing Fields",
            text: "Please fill out the title, description, due date, and status!",
            icon: "warning",
            confirmButtonColor: "#14b8a6"
        });
        return; // Stop the execution here so it won't hit the database
    }

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
        const modal =
bootstrap.Modal.getInstance(
document.getElementById('taskModal')
);

modal.hide();

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

    const statusColorClass = getBadgeColorClass(task.priority);
    const todayStr = new Date().toISOString().split("T")[0];
    const isOverdue = task.dueDate < todayStr && (task.priority === "pending" || task.priority === "Not started");

    let badgesHtml = `<span class="badge ${statusColorClass} px-3 py-2 mb-3 p-3 text-capitalize">${task.priority}</span>`;
    if (isOverdue) {
        badgesHtml += ` <span class="badge bg-danger px-3 py-2  mb-3">Overdue</span>`;
    }

    container.innerHTML += `
    <div class="col-md-6 col-12 col-lg-4 d-flex align-items-stretch mb-4">
        <div class="card p-3 shadow-lg border-0 h-100 w-100 d-flex flex-column">
            <div class="flex-grow-1">
                <div class="d-flex flex-wrap gap-1">
                    ${badgesHtml}
                </div>
                <h5 class="card-title fw-bold text-truncate-2 mt-1">
                    ${task.title}
                </h5>
                <p class="card-text text-secondary text-break">
                    ${task.description}
                </p>
                <p class="card-text text-secondary mb-1">
                    <small>Due Date: ${task.dueDate}</small>
                </p>
                <p class="card-text text-secondary mb-3">
                    <small>Created At: ${task.createdAt}</small>
                </p>
            </div>
            
            <div class="d-flex gap-2 mt-auto w-100">
                <button
                    class="btn btn-dark d-flex align-items-center justify-content-center gap-2"
                    data-bs-toggle="modal"
                    data-bs-target="#taskModalUpdate"
                    onclick="editTask('${task.id}')"
                >
                    <i class="bi bi-pencil-square"></i> Update
                </button>
                <button
                    class="btn btn-danger d-flex align-items-center justify-content-center gap-2" 
                    onclick="deleteTask('${task.id}')"
                >
                    <i class="bi bi-trash"></i> Delete
                </button>
            </div>
        </div>
    </div>
    `;
});
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

    const result = await Swal.fire({

        title: "Delete Task?",
        text: "You can restore it later.",
        icon: "warning",

        showCancelButton: true,


    });

    if(result.isConfirmed){

        try{

            await fetch(`${API}/${id}`,{

                method:"PATCH",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    isDeleted:true
                })

            });

            fetchTasks();

            Swal.fire({

                title: "Deleted!",
                text: "Task moved to deleted tasks.",
                icon: "success",
            });

        }catch(err){

            console.log(err);

        }

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

const today = new Date().toISOString().split("T")[0];

if(UpdatetaskDate < today){

    Swal.fire({
        title: "Invalid Due Date",
        text: "Due date cannot be in the past!",
        icon: "error",
        confirmButtonColor: "#ef4444"
    });

    return;
}


    if (!updateValue || !updateDescription || !UpdatetaskDate || !updateStatus) {
        Swal.fire({
            title: "Missing Fields",
            text: "Please fill out the title, description, due date, and status!",
            icon: "warning",
            confirmButtonColor: "#14b8a6"
        });
        return; // Stop the execution here so it won't hit the database
    }


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
          const modal =
bootstrap.Modal.getInstance(
document.getElementById('taskModalUpdate')
);

modal.hide();
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

    const statusColorClass = getBadgeColorClass(task.priority);
    

    const todayStr = new Date().toISOString().split("T")[0];
    const isOverdue = task.dueDate < todayStr && (task.priority === "pending" || task.priority === "Not started");

    // Build the dynamic badges collection
    let badgesHtml = `<span class="badge ${statusColorClass} px-3 py-2 mb-3 text-capitalize">${task.priority}</span>`;
    if (isOverdue) {
        badgesHtml += ` <span class="badge bg-danger px-3 py-2 mb-3">Overdue</span>`;
    }

    container.innerHTML += `
    <div class="col-md-6 col-12 col-lg-4 d-flex align-items-stretch mb-4">
        <div class="card p-3 shadow-lg border-0 h-100 w-100 d-flex flex-column">
            <div class="flex-grow-1">
                <div class="d-flex flex-wrap gap-1">
                    ${badgesHtml}
                </div>
                <h5 class="card-title fw-bold text-truncate-2 mt-1">
                    ${task.title}
                </h5>
                <p class="card-text text-secondary text-break">
                    ${task.description}
                </p>
                <p class="card-text text-secondary mb-1">
                    <small>Due Date: ${task.dueDate}</small>
                </p>
                <p class="card-text text-secondary mb-3">
                    <small>Created At: ${task.createdAt}</small>
                </p>
            </div>
            
            <div class="d-flex gap-2 mt-auto w-100">
                <button
                    class="btn btn-dark d-flex align-items-center justify-content-center gap-2"
                    data-bs-toggle="modal"
                    data-bs-target="#taskModalUpdate"
                    onclick="editTask('${task.id}')"
                >
                    <i class="bi bi-pencil-square"></i> Update
                </button>
                <button
                    class="btn btn-danger d-flex align-items-center justify-content-center gap-2" 
                    onclick="deleteTask('${task.id}')"
                >
                    <i class="bi bi-trash"></i> Delete
                </button>
            </div>
        </div>
    </div>
    `;
});
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
    <div class="col-md-6 col-12 col-lg-4 d-flex align-items-stretch mb-4">
        <div class="card p-3 shadow-lg border-0 h-100 w-100 d-flex flex-column">
            <div class="flex-grow-1">
                <span class="badge bg-primary w-25 mb-3">
                    ${task.priority}
                </span>
                <h5 class="card-title fw-bold text-truncate-2">
                    ${task.title}
                </h5>
                <p class="card-text text-secondary text-break">
                    ${task.description}
                </p>
                <p class="card-text text-secondary mb-1">
                    <small>Due Date: ${task.dueDate}</small>
                </p>
                <p class="card-text text-secondary mb-3">
                    <small>Created At: ${task.createdAt}</small>
                </p>
            </div>
            <div class="d-flex gap-3 mt-auto">
                <button
                    class="btn btn-danger w-100"
                    onclick="restoreTask('${task.id}')"
                >
                    Restore
                </button>
            </div>
        </div>
    </div>
    `;
});
         console.log(deletedTasks)

    }

  async function fetchOverDueTasks(){

    try {

        const response = await fetch(API)
        const tasks = await response.json()
        const today = new Date()

        const overDueTasks = tasks.filter(task =>
            task.userId === loggedInUser.id &&
            task.isDeleted === false &&
            new Date(task.dueDate) < today &&
            (task.priority === "pending" || task.priority === "Not started")
        )

        const container = document.getElementById('taskContainer')
        container.innerHTML = ""
       overDueTasks.forEach(task => {
    const statusColorClass = getBadgeColorClass(task.priority);

    container.innerHTML += `
    <div class="col-md-6 col-12 col-lg-4 d-flex align-items-stretch mb-4">
        <div class="card p-3 shadow-lg border-0 h-100 w-100 d-flex flex-column">
            <div class="flex-grow-1">
                <div class="d-flex flex-wrap gap-1">
                    <span class="badge ${statusColorClass} px-3 py-2 mb-3 text-capitalize">${task.priority}</span>
                    <span class="badge bg-danger px-3 py-2 mb-3">Overdue</span>
                </div>
                <h5 class="card-title fw-bold text-truncate-2 mt-1">
                    ${task.title}
                </h5>
                <p class="card-text text-secondary text-break">
                    ${task.description}
                </p>
                <p class="card-text text-danger fw-bold mb-1">
                    <small>Due Date: ${task.dueDate}</small>
                </p>
                <p class="card-text text-secondary mb-3">
                    <small>Created At: ${task.createdAt}</small>
                </p>
            </div>
            <div class="row g-2 mt-auto w-100 m-0">
                <div class="col-12 p-0">
                    <button
                        class="btn btn-overdue-urgent w-100 d-flex align-items-center justify-content-center gap-2"
                        data-bs-toggle="modal"
                        data-bs-target="#taskModalUpdate"
                        onclick="editTask('${task.id}')"
                    >
                        <i class="bi bi-pencil-square"></i> Update Overdue Task
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
});

    } catch(error) {
        console.log(error)
    }
}

async function restoreTask(id){

    const result = await Swal.fire({

        title: "Restore Task?",
        text: "Task will be moved back.",
        icon: "question",

        showCancelButton: true,

        confirmButtonText: "Yes, Restore",

      

    });

    if(result.isConfirmed){

        try{

            await fetch(`${API}/${id}`,{

                method:"PATCH",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    isDeleted:false

                })

            });

            fetchTasks();

            Swal.fire({

                title: "Restored!",
                text: "Task restored successfully.",
                icon: "success",

                confirmButtonColor: "#14b8a6",

                background: "#1e293b",
                color: "#fff"

            });

        }catch(error){

            console.log(error);

        }

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

    const currentTheme =
    document.documentElement.getAttribute('data-bs-theme');

    const newTheme =
    currentTheme === 'dark' ? 'light' : 'dark';

    applyTheme(newTheme);

    localStorage.setItem('theme', newTheme);

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
    if (e.target && (e.target.id === 'logoutBtn' || e.target.id === 'logout' || e.target.closest('#logoutBtn'))) {
        
        Swal.fire({
            title: "Logout?",
            text: "Are you sure you want to log out of TaskFlow?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Stay Logged In",
            confirmButtonColor: "#ef4444", 
            cancelButtonColor: "#14b8a6",  
            background: document.documentElement.getAttribute('data-bs-theme') === 'dark' ? '#1e293b' : '#ffffff',
            color: document.documentElement.getAttribute('data-bs-theme') === 'dark' ? '#fff' : '#000'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('loggedInUser');
                window.location.href = 'login.html';
            }
        });
    }
});

function setActiveFilter(btn, activeClass) {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.classList.remove('bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'text-white');
    });

    btn.classList.add(activeClass, 'text-white');
}