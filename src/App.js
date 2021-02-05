import { useEffect, useReducer, useState } from "react"

function flip() {
  return Math.floor(Math.random() * 2)
}

function reducer(state, action){
  switch(action.type){
    case "add": return [
      action.payload,
      ...state
    ]
    case "reset": return []
  }
}

function useCoinFlip(starting = 3){
  const [days, setDays] = useState(starting)
  const [history, dispatch] = useReducer(reducer, [])

  function flipCoins(){
    switch(flip() + flip()){
      case 0: 
        setDays( days - 1 )
        dispatch({type: "add", payload: -1})
        break;
      case 1:
        dispatch({type: "add", payload: 1})
        break;
      case 2:
        setDays( days + 2)
        dispatch({type: "add", payload: 3})
        break;
    }
  }

  function reset() {
    dispatch({type: "reset"})
    setDays(3)
  }

  return {days, flipCoins, history, reset}
}

function Remove({children}){
  return <span style={{
    color:"lime"
  }}>
    {children}
  </span>
}

function Add({children}){
  return <span style={{
    color:"#ff5501"
  }}>
    {children}
  </span>
}

function Add3({children}){
  return <span style={{
    color:"red"
  }}>
    {children}
  </span>
}

function formatHistory(value){
  switch (value) {
    case -1: return <Remove>{"The girls both got Tails"}</Remove>
    case 1: return  <Add>{"One of the girls got Heads"}</Add>
    case 3: return  <Add3>{"Both girls got Heads"}</Add3>
  }
}

export default function App() {
  const {days, flipCoins, history, reset} = useCoinFlip()
  const [auto, setAuto] = useState(false)

  function handleChecked(e){
    const checked = e.target.checked
    setAuto(checked)
  }

  useEffect(() => {
    if(auto && days !== 0){
      setTimeout(() => {
        flipCoins()
      }, Math.max(1000 / days, 100))
    }
  }, [history, auto])
  
  return (
    <div>
      <img src={"coins.jpeg"} />
      <h3>Days left: {days}</h3>
        <button onClick={flipCoins} disabled={days === 0}>
          Flip
        </button>
        <button onClick={reset} disabled={days !== 0}>
          Reset
        </button>
        <label htmlFor="auto">Auto-Flip</label>
        <input type="checkbox" onChange={handleChecked} id="auto"/>
      <div style={{height:'300px', overflow:'scroll'}}>
        {history.map((h, i) => <p>Day {(history.length - i).toString().padStart(2, 0)}: {formatHistory(h)}</p>)}
      </div>
    </div>
  )
}
