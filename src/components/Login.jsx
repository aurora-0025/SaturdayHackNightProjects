import jwt_decode from 'jwt-decode';
import {useEffect} from "react";

function Login({user, setUser}) {
  
function handleSignOut(event) {
  setUser(null);
  document.getElementById("buttonDiv").hidden = false;
}

  useEffect(
    ()=>{
      if(user) return;
      function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    var userData = jwt_decode(response.credential)
    setUser(userData)
    document.getElementById("buttonDiv").hidden = true;
  }
      
      /* global google */
      // @ts-ignore
          google.accounts.id.initialize({
            client_id: "251203627168-h884nioervb8cv4gnnrvltf5fugj89q1.apps.googleusercontent.com",
            callback: handleCredentialResponse
          });
          google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            { theme: "outline", size: "large" }  // customization attributes
          );
          google.accounts.id.prompt(); // also di
    }, [user, setUser])
  return (
    <div>
      {!user ?
      <div id="buttonDiv"></div>
        :        
        (<>
       <button className="border border-blue-500 hover:bg-blue-700 hover:text-white text-blue-500 text-sm font-semibold py-1 px-2 rounded" onClick={(e)=>handleSignOut(e)}>Sign Out</button>
        </>
        )
      }
    </div>
)}
    
export default Login
