function Inscription() {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-white text-center mb-6">Inscription</h1>
                
                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-2">Nom d'utilisateur</label>
                        <input 
                            type="text" 
                            placeholder="Votre nom d'utilisateur"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-300 mb-2">Email</label>
                        <input 
                            type="email" 
                            placeholder="Votre email"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-300 mb-2">Mot de passe</label>
                        <input 
                            type="password" 
                            placeholder="Votre mot de passe"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-300 mb-2">Confirmer le mot de passe</label>
                        <input 
                            type="password" 
                            placeholder="Confirmer votre mot de passe"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors"
                    >
                        S'inscrire
                    </button>
                </form>
                
                <p className="text-gray-400 text-center mt-4">
                    Déjà un compte ?{" "}
                    <Link to="/connexion" className="text-purple-500 hover:text-purple-400">
                        Se connecter
                    </Link>
                </p>
                
                <p className="text-gray-400 text-center mt-2">
                    <Link to="/" className="text-gray-500 hover:text-gray-300">
                        Retour à l'accueil
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Inscription;
