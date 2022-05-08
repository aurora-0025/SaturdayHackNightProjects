import { useEffect, useState } from "react"

const VoteBar = ({upvotes, downvotes}) =>{
    const [percent, setPercent] = useState(0); 

    useEffect(()=>{
        const total = upvotes + downvotes;
        if(total === 0) return setPercent(0)
        let upvotePercent = Math.floor(upvotes/total * 100);
        setPercent(upvotePercent);
    }, [upvotes, downvotes])
    return (
        <div className="flex flex-col justify-center items-center">
            <div className="h-2 w-[200px] rounded-lg md:w-[200px]" style={{background: `linear-gradient(to right ,  #D7FFB8 ${percent}%, #FFBF9B 100%)`}}></div>
            <b>{percent}%</b>
        </div>
    )
}

export default VoteBar;