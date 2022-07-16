import {useState, useRef} from 'react'

function Create({limiter, records, setRecords, setDone, user, base}) {
  
  function handleSubmit(e) {
    setButton(false);
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if(valueRef.current.value === "") return setError("Please enter something")
    else {
    limiter.schedule(() => base('postvity').create([
      {
        "fields": {
          "Email": user.email,
          "Name": user.name,
          "Image": user.picture,
          "Post": valueRef.current.value
        }
      }
    ], function(err, recs) {
      if (err) {
        console.error(err);
        valueRef.current.scrollIntoView();
        setButton(true);
        setError("Failed to create record");
        return;
      }
      recs.forEach(function (record) {
        console.log(record.getId());
        setSuccess("Successfully added your P😀ST");
      setButton(true);
      setDone(true);
      setRecords([...records, record])
      });
    })
    )
    }
  }
  
 const valueRef = useRef(null);
 const [error, setError] = useState(null);
 const [button, setButton] = useState(true);
 const [success, setSuccess] = useState(null);
  return (
    <div className="mx-3 mb-3 p-2 rounded-lg border border-3 border-blue-500 drop-shadow-lg text-left">
    {error &&
      <p className="w-full m-2 px-2 bg-red-200 rounded text-red-800">{error}</p>
    }
    {success &&
      <p className="w-full m-2 px-2 bg-green-200 rounded text-green-800">{success}</p>
    }
    
      <textarea maxLength={100} ref={valueRef} placeholder="If you could say one thing to the world what would it be?" className="caret-blue-800
        h-[150px]
        px-1
        w-full
        text-gray-700
        bg-transparent
        rounded
        m-0
       "></textarea>
      <hr/>
      <div className="w-full flex justify-end mt-2">
      {button ?
       ( <button onClick={(e)=>handleSubmit(e)} className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded">Send</button>)
        :   (<button className="bg-gray-500 text-white font-semibold py-1 px-4 rounded">Sending</button>)
      }
      </div>
    </div>
    )}
export default Create;
