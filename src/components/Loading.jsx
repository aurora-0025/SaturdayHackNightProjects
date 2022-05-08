const Loading = ({message}) => {
    return <div className="absolute backdrop-blur-md bg-white/30 h-screen w-screen overflow-hidden flex justify-center items-center">
        <h1 className="text-4xl">{message}</h1>
    </div>
}

export default Loading;