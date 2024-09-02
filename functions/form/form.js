"use client"
import { useState } from "react"


// main function
const mainFun =()=>{

// hooks
const [toggle, setToggle] = useState(false)
const [changing, setChanging] = useState(false)


// toggle
const toggled = () => {
    setToggle(!toggle)
}

// change
const change = (e) => {
    if (e.target.value) {
      setChanging(true)
    }
    else {
      setChanging(false)
    }
  }
return{toggle,changing,change,toggled}
}

export default mainFun;