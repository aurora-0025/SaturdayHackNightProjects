import React, { useEffect, useState } from "react";
import VoteBar from "./VoteBar";
import Cross from './icons/cross.svg'
import Tick from './icons/tick.svg'
import styles from './Results.module.css'

const Results = ({fetchData}) => {

    const [results, setResults] = useState();

    const upvote = (id, index)=> {
        const tempResults = results.slice();
        tempResults[index].upvotes += 1;
        setResults(tempResults);
        fetch("https://notion-poul.vercel.app/api/upvote", {
            method: "POST",
            body: JSON.stringify({pageId: id}),
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            }
          })
          .then(response => response.json())
          .then(data =>{
          }).catch((err)=> console.log(err))
      }

    const downvote = (id, index) => {
        const tempResults = results.slice();
        tempResults[index].downvotes += 1;
        setResults(tempResults);
        fetch("https://notion-poul.vercel.app/api/downvote", {
            method: "POST",
            body: JSON.stringify({pageId: id}),
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            }
          })
          .then(response => response.json())
          .then(data =>{
          }).catch((err)=> console.log(err))
    }

    const fetchPages = () =>{
         fetch("https://notion-poul.vercel.app/api/fetchpages", {
           method: "get",
           headers: {
             "Accept": "application/json",
             "Content-Type": "application/json"
           }
         })
         .then(response => {
             return response.json()})
         .then(data =>{
             setResults(data);
         }).catch((err)=> console.log(err))
      }

    useEffect(()=>{
        fetchPages();
    }, [fetchData])
    return (
        <div className="mt-2 max-w-full">
            {
            results &&
            results.map((result, index)=> (
                <div key={index} className={`${styles.resultCard} mx-5 max-w-[500px] md:max-w-[700px] rounded mt-4 p-4 flex justify-between items-center`}>
                <div className="max-w-[50%]">
                    <h1 className="font-bold text-xl lg:text-4xl break-words">{result.title}</h1>
                    <p className="text-xl text-ellipsis break-words">{result.desc}</p>
                    <div className="flex gap-x-2">{result.tags.map((tag, index)=> (
                        <div key={index} className="rounded-lg w-max mt-4 cursor-pointer font-bold px-4 py-1 text-center" style={{"backgroundColor": tag.color.toLowerCase().split(" ").join("")}}>
                            {tag.name}
                        </div>
                    ))}</div>
                </div>
                    <div className="">
                        <div className="flex justify-center gap-4">
                            <button className={`${styles.upvoteButton} w-[50px]  h-[50px] rounded-full hover:scale-110 flex items-center justify-center px-2 py-1 my-2`} onClick={()=> { upvote(result.id, index)}}><img src={Tick} alt=""></img></button>
                            <button className={`${styles.downvoteButton} w-[50px] h-[50px] rounded-full hover:scale-110 flex items-center justify-center px-2 py-1 my-2`} onClick={()=> { downvote(result.id, index)}}><img src={Cross} alt=""></img></button>
                        </div>
                        <VoteBar upvotes={result.upvotes} downvotes={result.downvotes} />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Results;