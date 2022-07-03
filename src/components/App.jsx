import React , {useEffect, useRef, useState} from 'react'
import MonacoEditor from './Editor'
import styles from './App.module.css'

export default function App() {  
  const [to, setTo] = useState([]);
  const [toInput, setToInput] = useState("");
  const [sendStatus, setSendStatus] = useState("SEND");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [subjectInput, setSubjectInput] = useState("");
  const [html,setHtml] = useState('<div class="example"> Type you HTML here! </div>')
  const [css,setCss] = useState(
  `.example {
    color: red;
  }
  `)
  const toInputRef = useRef(null);
  const topRef = useRef(null);

  const sendMail = (to, sub, htmlSrc)=> {
    setSendStatus("SENDING...")
    if(to.length === 0) return setError(" please enter a to Address!");
    if(subjectInput === "") return setError(" please enter a subject for the mail!");
    console.log(htmlSrc);
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
        if(data) { 
        topRef.current.scrollIntoView()
        setSuccess("Mail sent successfully! check your spam folder too.")
        setError(null);
        setSubjectInput("");
        setSendStatus("SEND")
        setHtml(`<div class="example"> Type your HTML here! </div>`)
        setCss(`
        .example {
          color: red;
        }
        `)
        }
      }).catch((err)=> setError("failed to send the mail"))
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
      <head>
        <style>${css}</style>
      </head>
      <body>${html}</body>
    </html>
    `
    
    return (
        <>
        <div ref={topRef} className="flex max-w-screen mx-5 flex-col items-center">
          <div className='w-full '>
          <h1 className='text-6xl text-center font-bold pt-3'>INFLATED EMAILS</h1>
          <h1 className='text-3xl text-center '>Make your own custom e-mails ;&#41;</h1>
          {error ?
            (
              <p className='font-bold pt-5 text-center text-red-600'>{error}</p>
            ) : null
          }
          {success ?
            (
              <p className='font-bold pt-5 text-center text-lime-500'>{success}</p>
            ) : null
          }
          <h1 className="font-bold	pt-3">To</h1>
          <div onClick={()=> toInputRef.current.focus} className={`${styles.textInput} w-full bg-slate-50 border-2 border-black flex items-center pl-2 h-9 rounded-lg`}>
              {to? <div className="flex text-center cursor-pointer items-center gap-2 ml-2 py-1">
                {to.map((to, index)=>(
                  <div key={index} onClick={()=>{removeTo(index)}} className="bg-red-300 px-3 rounded-lg">
                    <p>{to}</p>
                  </div>
                  )
                )}</div> : null}
              <input style={{"all": "unset", "paddingLeft": "5px", "width": "100%"}} ref={toInputRef}  type="text" onBlur={(e)=> setToInput(e.target.value + " ")}  value={toInput} onChange={(e)=> setToInput(e.target.value)} />
            </div>
            <h1 className="font-bold pt-3">Subject</h1>
          <input className='w-full border-black bg-slate-50 border-2 flex items-center pl-2 h-9 rounded-lg' type="text" onChange={e => {
            e.preventDefault()
            setSubjectInput(e.target.value)
            }} name="subject" id="sub" />
          </div>

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
          <h1 className="font-bold text-center py-5">PREVIEW</h1>
              <iframe 
                  className="border-4 border-black rounded-lg"
                  srcDoc={srcDoc}
                  title='output'
                  sandbox='allow-scripts'
                  frameBorder="0"
                  width="100%"
                  height="100%"
              />
          </div>
          </div>
          <button className="font-bold border-2 border-black bg-lime-500 my-5 px-5 w-[200px] rounded-lg py-2 hover:scale-105 hover:bg-lime-600 hover:text-white" onClick={()=>sendMail(to, subjectInput, srcDoc)}>{sendStatus}</button>
          <div className='pt-1 pb-4'>Created with 💙 by inflated papadam</div>
        </div>
        </>
  )
}
