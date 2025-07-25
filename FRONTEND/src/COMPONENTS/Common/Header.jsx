import TopBar from "../Layout/TopBar";
import { Navbar } from "./Navbar";


const Header = () =>{
    return (
        <header className="Navbar-header">
        <TopBar />
        <Navbar />
        </header>
    )
}

export default Header;