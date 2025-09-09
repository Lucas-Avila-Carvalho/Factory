import NavBar from "../components/NavBar/NavBar"
import "./main.css"

const Guest = ({ children }) => {
    return (
        <>
            <NavBar />
            <main className="guest_main">
                <div>
                    {children}
                </div>
            </main>
        </>
    )
}

export default Guest