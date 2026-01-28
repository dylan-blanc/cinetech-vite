import { Link } from "react-router-dom";
import LogoCNT from "../assets/LogoCNT.png";

function Header() {
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
                    <div className="flex-1 max-w-md mx-8">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                🔍
                            </span>
                            <input 
                                type="text" 
                                placeholder="Rechercher...."
                                className="w-full bg-gray-800 border border-gray-600 rounded px-10 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

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
                    </nav>
                </div>
            </div>
            {/* Ligne violette en bas du header */}
            <div className="h-1 bg-gray-800"></div>
        </header>
    );
}

export default Header;