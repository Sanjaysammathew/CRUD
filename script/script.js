const API = "http://localhost:3000/tasks"

let editingId = 0


async function addTask(){

    const input =
    document.getElementById('taskInput')

    const desInput =
    document.getElementById('taskDescription')

    const value = input.value.trim()

    const desValue = desInput.value.trim()

    try{

        await fetch(API,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                title:value,
                description:desValue

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

        const tasks =
        await response.json()

        const container =
        document.getElementById('taskContainer')

        
        container.innerHTML = ""


        tasks.forEach(task => {

            container.innerHTML += `

            <div class="col-md-4 col-12">

                <div class="card p-3 shadow-lg border-0 h-100">

                    <span class="badge bg-primary w-25 mb-3">
                        Work
                    </span>

                    <h5 class="card-title fw-bold">
                        ${task.title}
                    </h5>

                    <p class="card-text text-secondary">
                        ${task.description}
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

    const response =
    await fetch(`${API}/${id}`)

    const task =
    await response.json()

    update.value = task.title

    updateDescription.value =
    task.description

    } catch(error){
        console.log(error)
    }

}

async function deleteTask(id){
    try{
     await fetch(`${API}/${id}`,{
        method: "DELETE"
     })
    }catch(err){
    console.log(err)
    }
}


async function updateTask(id){
    const update =document.getElementById('updateValue')
    const updateValue=update.value.trim()

    const updateDes=document.getElementById('updateDescription')
    const updateDescription=updateDes.value.trim()

    try{
      
        await fetch(`${API}/${id}`, {

            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: updateValue,
                description:updateDescription
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
fetchTasks()