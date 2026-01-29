/**
 * InputForm - Composant d'input contrôlé réutilisable
 *
 * @param {string} label - Texte affiché sur le label
 * @param {string} name - Identifiant unique pour l'id et le name de l'input
 * @param {function} onChange - Callback appelé à chaque modification (reçoit l'event)
 * @param {string} value - Valeur actuelle de l'input (controlled component)
 * @param {string} error - Message d'erreur à afficher
 * @param {string} placeholder - Texte d'indication
 * @param {string} type - Type d'input HTML (défaut: "text")
 * @param {string} classParent - Classes CSS du conteneur
 * @param {string} classInput - Classes CSS de l'input
 * @param {string} classLabel - Classes CSS du label
 * @param {string} classError - Classes CSS du message d'erreur
 */
function InputForm({
    label,
    name,
    onChange,
    value,
    error,
    placeholder = "",
    type = "text",
    classParent = "",
    classInput = "w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500",
    classLabel = "block text-gray-300 mb-2",
    classError = "text-red-500 text-sm mt-1"
}) {
    // Utilise name si fourni, sinon génère un id basé sur le label
    const inputId = `id-${name || label?.toLowerCase().replace(/\s+/g, '-')}`;
    const inputName = name || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={classParent}>
            {/* htmlFor lie le label à l'input pour l'accessibilité (clic sur label = focus input) */}
            {label && (
                <label htmlFor={inputId} className={classLabel}>
                    {label}
                </label>
            )}
            <input
                id={inputId}
                name={inputName}
                className={classInput}
                type={type}
                // value : lie l'input au state (input contrôlé)
                value={value}
                // onChange : met à jour le state à chaque frappe
                onChange={onChange}
                placeholder={placeholder}
            />

            {/* Affichage conditionnel du message d'erreur */}
            {error && <p className={classError}>{error}</p>}
        </div>
    );
}

export default InputForm;