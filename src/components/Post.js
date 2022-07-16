function Post({record}) {
return (
    <div className='m-3 p-2 rounded-lg border border-3 border-blue-500 drop-shadow-lg shadow-sm text-left'>
      <div className='flex items-center mx-3'>
        <img className='rounded-full w-[30px] h-[30px] border border-white border-3' src={record.fields.Image}/>
        <div className='flex mx-2 flex-col items-start'>
          <h1 className='font-bold text-sm'>{record.fields.Name}</h1>
          <h2 className='text-gray-800 text-xs'>{record.fields.Email}</h2>
        </div>
      </div>
        <p className="m-3 border-l-3 border-blue-500 text-md break-words">
         {record.fields.Post}
        </p>
      <p className="m-3 text-gray-800 text-xs">{record._rawJson.createdTime.substring(0, 10).split('-').join('/')}</p>
    </div>
  )
}
export default Post;
