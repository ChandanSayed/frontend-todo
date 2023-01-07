import { useState, useEffect } from "react"
import Axios from 'axios'
import './App.css';

function App() {

  const [items, setItems] = useState([])
  const [itemValue, setItemValue] = useState("")
  const [editItem, setEditItem] = useState(true)
  const [editId, setEditID] = useState("")

  const getTheItemsValue = async () => {
    const res = await Axios.get("https://first-mern-todo.onrender.com")
    setItems(res.data)
  }
  useEffect(() => {
    getTheItemsValue()
  }, [])
  const handleForm = async e => {
    e.preventDefault()
    if (itemValue === "") {
      return
    }
    else if (!editItem && itemValue !== "") {
      const res = await Axios.post("https://first-mern-todo.onrender.com/update-item", { id: editId, item: itemValue })
      // console.log(res.data.item)
      setEditItem(prev => prev = true)
      setItems(prev => prev.map(currentItems => {
        if (currentItems._id === editId) {
          return { ...currentItems, item: itemValue }
        }
        return currentItems
      }))
      setItemValue(prev => prev = "")
      return res
    }
    const res = await Axios.post("https://first-mern-todo.onrender.com/create-item", { item: itemValue })
    // console.log(res)
    setItems(prev => prev.concat(res.data))
    setItemValue(prev => prev = "")
  }

  const ItemList = (props) => {
    const viewItem = () => {
      // console.log(props.id)
      setItemValue(prev => prev = props.item)
      setEditItem(prev => prev = false)
      setEditID(prev => prev = props.id)
    }

    const deleteItem = () => {
      setItems(prev => prev.filter(item => item._id !== props.id))
      Axios.post("https://first-mern-todo.onrender.com/delete-item", { id: props.id })
    }
    return (
      <li>{props.item} <button onClick={viewItem}>Edit</button> <button onClick={deleteItem}>Delete</button> </li>
    )
  }
  // const updateItem = async () => {
  //   const res = await Axios.post("http://localhost:5000/update-item", { id: "", item: itemValue })
  // }
  return (
    <>
      <form action="/" onSubmit={handleForm} method="POST">
        <input type="text" value={itemValue} onChange={e => setItemValue(e.target.value)} />
        {editItem ? <input type="submit" value="Add Item" /> : <input type="submit" value="Update Item" />}
      </form>
      <ul>
        {items.map(item => {
          return <ItemList item={item.item} key={item._id} id={item._id} />
        })}
      </ul>
    </>
  );
}

export default App;
