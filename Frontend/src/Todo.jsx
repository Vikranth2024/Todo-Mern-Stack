import { useEffect, useState } from "react";

function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");
    const [editid, setEditid] = useState(-1); // Fixed: Use array destructuring
    const apiURL = "http://localhost:8030";

    const [edittitle, setEdittitle] = useState("");
    const [editdescription, setEditdescription] = useState("");

    const handleSubmit = () => {
        setErr(""); // Clear previous error
        setMsg(""); // Clear previous message

        if (title.trim() !== "" && description.trim() !== "") {
            fetch(apiURL + '/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            })
            .then((res) => {
                if (res.ok) {
                    // Add the new todo to the list
                    setTodos([...todos, { title, description }]);

                    setTitle(""); // Clear title input
                    setDescription(""); // Clear description input

                    setMsg("Item added successfully");
                    setTimeout(() => {
                        setMsg("")
                    }, 2000);
                } else {
                    setErr("Unable to create Todo item");
                }
            })
            .catch(() => {
                setErr("An error occurred while creating the Todo item");
            });
        } else {
            setErr("Title and description cannot be empty");
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiURL + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodos(res);
            });
    };

    const handleEdit = (item) =>{
        setEditid(item._id); // Set editid to the current item's _id
        setEdittitle(item.title); // Set edittitle to the current item's title
        setEditdescription(item.description); // Set editdescription to the current item's description
    }


    const handleUpdate = () => {
        setErr(""); 

        if (edittitle.trim() !== "" && editdescription.trim() !== "") {
            fetch(apiURL + '/todos/'+ editid, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title : edittitle, description : editdescription })
            })
            .then((res) => {
                if (res.ok) {
                    // Update the new todo to the list
                    const updatedTodos = todos.map((item) =>{
                        if (item._id == editid){
                            item.title = edittitle
                            item.description = editdescription
                         }
                         return item
                    })
                    setTodos(updatedTodos);
                    setEdittitle("")
                    setEditdescription("")
                    setMsg("Item added successfully");
                    setTimeout(() => {
                        setMsg("")
                    }, 2000);

                    setEditid(-1)
                } else {
                    setErr("Unable to create Todo item");
                }
            })
            .catch(() => {
                setErr("An error occurred while creating the Todo item");
            });
        } else {
            setErr("Title and description cannot be empty");
        }
    };


    const handleEditCancel = ()=>{
        setEditid(-1)
    }

    const handleDelete = (id)=>{
        if(window.confirm('Are you sure?')){
            fetch(apiURL+"/todos/"+id,{
                method: "DELETE",

            }).then(() =>{
                const updatedTodos = todos.filter((item) => item._id !== id)
                setTodos(updatedTodos)
            })

        }
    }

    return (
        <>
            <div className="row p-3 bg-success text-light">
                <h1>Todo Project with Mern</h1>
            </div>
            <div className="row">
                <h3>Add item</h3>
                {msg && <p className="text-success">{msg}</p>}
                <div className="form-group d-flex gap-2">
                    <input
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control"
                        type="text"
                    />
                    <input
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-control"
                        type="text"
                    />
                    <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
                </div>
                {err && <p className="text-danger">{err}</p>}
            </div>


            <div className="row mt-3 ">
                <h3>Tasks</h3>

                <div className="col-md-6">

                <ul className="list-group">
                    {
                        todos.map((item, index) => (
                            <li key={index} className="list-group-item bg-warning d-flex justify-content-between align-items-center my-2">
                                <div className="d-flex flex-column me-2">
                                    {
                                        editid === item._id ? ( // Check if the current item is being edited
                                            <>
                                                <div className="form-group d-flex gap-2">
                                                    <input
                                                        placeholder="Title"
                                                        value={edittitle} // Use edittitle state
                                                        onChange={(e) => setEdittitle(e.target.value)}
                                                        className="form-control"
                                                        type="text"
                                                    />
                                                    <input
                                                        placeholder="Description"
                                                        value={editdescription} // Use editdescription state
                                                        onChange={(e) => setEditdescription(e.target.value)}
                                                        className="form-control"
                                                        type="text"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <span className="fw-bold">{item.title}</span>
                                                <span>{item.description}</span>
                                            </>
                                        )
                                    }
                                </div>
                                <div className="d-flex gap-2">
                                    {
                                        editid === item._id ? ( // Check if the current item is being edited
                                            <button className="btn btn-info" onClick={handleUpdate}>Update</button>
                                        ) : (
                                            <button className="btn btn-info" onClick={() => handleEdit(item)}>Edit</button>
                                        )
                                    }
                                    {
                                        editid == -1 ? <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button> 
                                        : 
                                        <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>

                                    }
                                    

                                </div>
                            </li>
                        ))
                    }
                </ul>
                </div>
            </div>
        </>
    );
}

export default Todo;