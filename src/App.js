import {

  useState,

  useEffect

} from 'react'

import Login from './components/Login'

import Post from './components/Post'

import Create from './components/Create'

import Airtable from 'airtable'

import Bottleneck from "bottleneck";

const limiter = new Bottleneck({

  maxConcurrent: 5,

  minTime: 333

});

const base = new Airtable({

  apiKey: process.env.AIRTABLE_API_KEY

}).base('appdslBSpUnEvaXN7')

function App() {

  const [user,

    setUser] = useState(null);

  const [done,

    setDone] = useState(false);

  const [loading,

    setLoading] = useState(false);

  const [records,

    setRecords] = useState(null)

  useEffect(

    ()=> {

      if (!user) return;

      setLoading(true);

      limiter.schedule(() => base('postvity').select({

        view: "Grid view"

      }).eachPage(function page(records, fetchNextPage) {

        setRecords(records);

        console.log(records)

        records.forEach(function(record) {

          if (user.email === record.get('Email')) setDone(true);

        });

        fetchNextPage();

      }, function done(err) {

        setLoading(false);

        if (err) {

          console.error(err); return;

        }

      })

      )

    }, [user])

  return (

    <>

    {loading ? <div className="absolute mt-[50vh] ml-[50vw] translate-y-[-50%] translate-x-[-50%] text-blue-500 font-lobster text-4xl">Loading..</div>

    :

    <div className="m-5 w-max-screen overflow-hidden">

        <h1 className="my-4 text-center text-blue-500 font-lobster text-6xl">Postvity</h1>

        {

          !user &&

          <>

          <p className='text-center font-bold text-gray-800 mt-3'>

            "If you had one thing to say to the world what would it be"

          </p>

          <h1 className='text-center mt-[15vh]'>To continue signin</h1> 

          </>

        } 

        <div className="flex flex-col items-center w-full justify-center" >

        <Login user={user} setUser={setUser} />

        </div>

      {user &&

        <div>

        {!done && (

          <>

          <h1 className="mx-5 mt-5 text-xl font-bold">Spread your love</h1>

          <Create limiter={limiter} records={records, setRecords} setDone={setDone} user={user} base={base} /> < />

        )}

        {records && (

          <div className="mt-9">

          <h2></h2>

         {records.map((record, index)=> <Post key={index} record={record} />)}

          </div>

          )}

        </div>

      }

      </div>

    }

    </>

      )}

        export default App;
