/**
 * InputForm - Composant d'input contrôlé réutilisable
 *
 * @param {string} label - Identifiant unique servant pour l'id, le name et le texte du label
 * @param {function} onChange - Callback appelé à chaque modification (reçoit l'event)
 * @param {string} value - Valeur actuelle de l'input (controlled component)
 * @param {string} placeholder - Texte d'indication (défaut: "Entrez votre")
 * @param {string} type - Type d'input HTML (défaut: "text")
 * @param {string} classParent - Classes CSS du conteneur
 * @param {string} classEnfant - Classes CSS de l'input
 * @param {string} classLabel - Classes CSS du label
 */
function InputForm(
    {
        label,
        onChange,
        value,
        error,
        placeholder = "Entrez votre",
        type = "text",
        classParent = "flex flex-col",
        classEnfant = "border-2 border-amber-700 rounded-2xl",
        classLabel = "text-xl md:text-2xl"
    }) {

    return (
      <div className={classParent}>
        {/* htmlFor lie le label à l'input pour l'accessibilité (clic sur label = focus input) */}
        <label htmlFor={`id-${label}`} className={classLabel}>
          Entrez votre {label}
        </label>
        <input
          id={`id-${label}`}
          name={label}
          className={classEnfant}
          type={type}
          // value : lie l'input au state (input contrôlé)
          value={value}
          // onChange : met à jour le state à chaque frappe
          onChange={onChange}
          placeholder={`${placeholder} ${label}`}
        />

        {/* Affichage en temps réel de la valeur saisie */}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
}

export default InputForm;