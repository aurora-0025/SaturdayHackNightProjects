import React , {useEffect, useRef, useState} from 'react'
import MonacoEditor from './Editor'
import styles from './App.module.css'

export default function App() {  
  const [to, setTo] = useState([]);
  const [toInput, setToInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [html,setHtml] = useState('<div class="example"> Hello World Email! </div>')
  const [css,setCss] = useState(
  `.example {
    color: red;
  }
  `)
  const toInputRef = useRef(null);

  const sendMail = (to, sub, htmlSrc)=> {
    fetch("https://shn-3-gmail-api.vercel.app/api/sendMail", {
        method: "POST",
        body: JSON.stringify({
          addresses: to,
          subject: sub,
          htmlSrc: htmlSrc
        }),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(data =>{
      }).catch((err)=> console.log(err))
  }

  useEffect(()=>{
      const splitInput = toInput.split(" ")
      if(splitInput.length === 2 ){
        if(toInput[0] === " ") return setToInput("");
        setToInput("")
        if(!splitInput[0].endsWith('@gmail.com')) return setToInput("");
        setTo(prevState=> [...prevState, splitInput[0]])
      }
    }, [toInput])
  
    const removeTo = (index) =>{
      setTo(to.filter((o, i) => index !== i));
    }
    
    const srcDoc = `
    <html>
      <body>${html}</body>
      <style>${css}</style>
    </html>
    `
    
    return (
        <>
        <div className="flex max-w-screen flex-col">
          <div className='w-full '>
          <h1>To</h1>
          <div onClick={()=> toInputRef.current.focus} className={`${styles.textInput} w-full bg-slate-50 border-2 flex items-center pl-2 h-9 rounded-lg`}>
              {to? <div className="flex text-center cursor-pointer items-center gap-2 ml-2 py-1">
                {to.map((to, index)=>(
                  <div key={index} onClick={()=>{removeTo(index)}} className="bg-red-300 px-3 rounded-lg">
                    <p>{to}</p>
                  </div>
                  )
                )}</div> : null}
              <input style={{"all": "unset", "paddingLeft": "5px", "width": "100%"}} ref={toInputRef}  type="text"  value={toInput} onChange={(e)=> setToInput(e.target.value)} />
            </div>
          </div>
          <h1>Subject</h1>
          <input className='w-full bg-slate-50 border-2 flex items-center pl-2 h-9 rounded-lg' type="text" onChange={e => {
            e.preventDefault()
            setSubjectInput(e.target.value)
            }} name="subject" id="sub" />
          <div className='h-full w-full'>
          <div className=" w-full gap-y-10 flex md:flex-col">
            <MonacoEditor
            language="html"
            value={html}
            onChange={setHtml} 
            />
            <MonacoEditor
            language="css"
            value={css}
            onChange={setCss} 
            />
          </div>
          <div className='w-full'>
          <h1>PREVIEW</h1>
              <iframe 
                  className='border-2'
                  srcDoc={srcDoc}
                  title='output'
                  sandbox='allow-scripts'
                  frameBorder="0"
                  width="100%"
                  height="100%"
              />
          </div>
          </div>
          <button onClick={()=>sendMail(to, subjectInput, srcDoc)}>SEND</button>
        </div>
        </>
  )
}
