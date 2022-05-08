import styles from './App.module.css';
import React, { useEffect, useRef, useState } from "react" 
import Results from './components/Results';
import Loading from './components/Loading';

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagsInput, setTagsInput] = useState("")
  const [fetchData, setFetchData] = useState(0);
  const [inputError, setInputError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("loading");

  const titleInputRef = useRef(null);
  const descInputRef = useRef(null);
  const tagsInputRef = useRef(null);

  useEffect(()=>{
    const splitInput = tagsInput.split(" ")
    if(splitInput.length === 2 ){
      if(tagsInput[0] === " ") return setTagsInput("");
      setTagsInput("")
      setTags(prevState=> [...prevState, splitInput[0]])
    }
    
  }, [tagsInput])

  const removeTag = (index) =>{
    setTags(tags.filter((o, i) => index !== i));

  }

  const submitToNotion = () =>{
    if(titleInputRef.current.value === "") return setInputError("A Title Is Required");
    if(descInputRef.current.value === "") return setInputError("Description Is Required");
    setLoading(true)
    setLoadingMsg("Submitting")
    setInputError(null);
    titleInputRef.current.value= "";
    descInputRef.current.value= "";
    setTags([])
     fetch("https://notion-poul.vercel.app/api/submitpoll", {
       method: "post",
       headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
       },
       body: JSON.stringify({
         name: title,
         description: description,
         tags: tags
       })
     }).then(response => {
       if(response.statusText === "OK") {
         setFetchData(fetchData+1)
         setLoading(false)
         setLoadingMsg("Loading")
        }
        console.log(fetchData);
     }).then(data=> {
      console.log("Success", data)
    }).catch((err)=> console.log(err))
  }

  return (
    <>
    {loading ? 
      <Loading message={loadingMsg} />
      : (
        <div className={`${styles.main_container} bg-white flex flex-col px-2`}>
        <div className='flex justify-between items-center'>
            <h1 className='text-2xl font-bold md:text-4xl'>Create A Poul.</h1>
            <a href="https://low-chimpanzee-ca8.notion.site/bf70170980104039b0f16df52f058534?v=867ca5aba64743a89d73672048f6794d">View On Notion</a>
        </div>
        <div className='mt-5 flex flex-col gap-3 mx-7'>
          <h2 className='font-semibold'>Title</h2>
          <input ref={titleInputRef} className={`${styles.textInput} h-9 pl-2 rounded-lg`} type="text" id="title" onChange={(e)=> setTitle(e.target.value)} />
          <h2 className='font-semibold'>Description</h2>
          <textarea ref={descInputRef} style={{"resize": "none"}} className={`${styles.textInput} h-[100px] w-[300px] pl-2 pt-2 lg: w-full h-9 rounded-lg`} type="text" id="description" onChange={(e)=> setDescription(e.target.value)} />
          <h2 className='font-semibold'>Tags</h2>
          <div id="tag-wrapper" onClick={()=> tagsInputRef.current.focus} className={`${styles.textInput} flex items-center  pl-2 h-9 rounded-lg`}>
            {tags? <div className="flex text-center cursor-pointer items-center gap-2 ml-2 py-1">
              {tags.map((tag, index)=>(
                <div key={index} onClick={()=>{removeTag(index)}} className="bg-red-300 px-3 rounded-lg">
                  <p>{tag}</p>
                </div>
                )
              )}</div> : null}
            <input style={{"all": "unset", "paddingLeft": "5px", "width": "100%"}} ref={tagsInputRef}  type="text"  value={tagsInput} onChange={(e)=> setTagsInput(e.target.value)} />
          </div>
          <button className={`${styles.textInput} ${styles.submitBtn} font-bold rounded-lg w-24 px-4 py-2 hover:scale-110 mt-5`} onClick={submitToNotion}>Submit</button>
          {inputError && 
          <p className='red-400'>{inputError}</p>}
        </div>
        <div className='flex flex-col items-center justify-center'>
        <h1 className="text-4xl mt-7 font-bold">Recent Pouls</h1>
          <Results fetchData={fetchData}/>
        </div>
        <div className='flex flex-col mt-5 items-end'>
                <h1 className='text-3xl font-semibold'>Poul</h1>
                <p className='text-xl'>by deflated pappadam</p>
        </div>
      </div>
      )
    }

    </>
  );
}

export default App;
