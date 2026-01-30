import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import LogoCNT from "../assets/LogoCNT.png";
import SearchBar from "./SearchBar";

function Header() {
    const { isAuthentificated, logout } = useAuth();
    return (
        <header style={{ backgroundColor: '#282129' }}>
            <div className="container mx-auto px-4 py-2">
                <div className="flex justify-between items-center">
                    {/* Logo - lien vers l'accueil */}
                    <Link to="/">
                        <img 
                            src={LogoCNT} 
                            alt="Logo CNT" 
                            className="h-20 ml-8 cursor-pointer"
                        />
                    </Link>

                    {/* Barre de recherche */}
                    <SearchBar />

                    {/* Navigation - Connexion et Inscription */}
                    <nav className="flex items-center gap-4">
                        <Link 
                            to="/connexion" 
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Connexion
                        </Link>
                        <Link 
                            to="/inscription" 
                            className="border border-purple-500 text-purple-500 px-4 py-1 rounded hover:bg-purple-500 hover:text-white transition-colors"
                        >
                            Inscription
                        </Link>
                        {isAuthentificated() && (
                            <Link
                            to="/"
                            >
                            <button 
                                onClick={logout} 
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                Déconnexion
                            </button>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
            {/* Ligne violette en bas du header */}
            <div className="h-1 bg-gray-800"></div>
        </header>
    );
}

export default Header;