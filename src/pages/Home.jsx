import axios from 'axios'
import React,{useContext, useEffect, useState} from 'react'
import { Context, server } from '../main'
import { toast } from 'react-hot-toast'
import Task from '../components/Task'
import { Navigate } from 'react-router-dom'

const Home = () => {
  
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState([])
  const [refresh, setRefresh] = useState(false)
  const { isAuthenticated } = useContext(Context);

  const updateHandler = async (id)=>{
    try {
    const {data} = await axios.put(`${server}/task/${id}`,
      {},
      {
        withCredentials: true,
      })
      toast.success(data.message)
      setRefresh(prev=>!prev)
    } catch (error) {
      toast.error(error.response.data.message);
    }
    
  }
  const deleteHandler = async (id)=>{
    try {
      const {data} = await axios.delete(`${server}/task/${id}`,
      {
        withCredentials: true,
      })
      toast.success(data.message)
      setRefresh(prev=>!prev)
      } catch (error) {
        toast.error(error.response.data.message);
      }

  }
  const submitHandler = async (e)=>{
    e.preventDefault();
    setLoading(true)
    try {
      const {data} = await axios.post(`${server}/task/new`,{
        title,
        description
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        },
      })
      setTitle("")
      setDescription("")
      toast.success(data.message);
      setLoading(false)
      setRefresh(prev=>!prev)
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false)
      
    }
  }

  useEffect(()=>{
    axios.get(`${server}/task/mytask`,{
      withCredentials: true,
    })
    .then((res)=>{
      setTasks(res.data.tasks)

    })
    .catch((e)=>{
      toast.error(error.response.data.message)
    })
  },[refresh])

  if(!isAuthenticated) return <Navigate to={'/login'} />
  return (
    <div className="container">
      <div className="login">
      <section>
      <form onSubmit={submitHandler}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit">Add Task</button>

        </form>
      </section>
      </div>
      <section className="todosContainer">
        {
          tasks.map((i)=>(
            <Task 
              title={i.title}
              description={i.description} 
              isCompleted={i.isCompleted}
              updateHandler={updateHandler}
              deleteHandler={deleteHandler}
              id={i._id}
              key={i._id}
            />
          ))
        }
      </section>
    </div>
  )
}

export default Home