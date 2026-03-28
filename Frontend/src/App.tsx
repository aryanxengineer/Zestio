import Navbar from "./components/Navbar"
import { useAppData } from "./context/AppContext"
import Restaurant from "./pages/Restaurant"
import Routing from "./routes/route"

const App = () => {

  const { user } = useAppData();

  if (user?.role === 'seller') {
    return <Restaurant />
  }

  return (

    <>
      <Navbar />
      <Routing />
    </>
  )
}

export default App