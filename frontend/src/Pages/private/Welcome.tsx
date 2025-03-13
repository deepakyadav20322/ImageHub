
import { Button } from "@/components/ui/button"
import { logout } from "@/redux/features/authSlice";
import { RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"

const Welcome = () => {
  const {user} = useSelector((state:RootState)=>state.auth);
  const dispatch = useDispatch()
  return (
    <>
    <div className="pb-4">Welcome Page, {JSON.stringify(user,null,2)}</div>
       <Button onClick={()=>dispatch(logout())}>Logout</Button>
    </>
  )
}

export default Welcome