import Navbar from "./components/Navbar"
import Routing from "./routes/route"
import { Toaster } from "react-hot-toast"

const App = () => {
  return (

    <>
      <Navbar />
      <Routing />
      <Toaster />
    </>
  )
}

export default App