import React, { useState } from 'react';

const Formulaire = () => {
  const [formData, setFormData] = useState({ 
    id: '', 
    nom: '', 
    poste: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Réinitialiser les messages d'erreur/succès quand l'utilisateur tape
    if (error) setError('');
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi des données');
      }

      const result = await response.json();
      
      // Succès
      setSuccess(true);
      setFormData({ id: '', nom: '', poste: '' }); // Réinitialiser le formulaire
      
    } catch (err) {
      console.error('Erreur :', err);
      setError('Impossible d\'envoyer le formulaire. Vérifiez votre connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Titre */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Nouveau Contact
          </h1>
          <p className="text-slate-400 mt-2">Ajoutez un nouveau contact à la liste</p>
        </div>

        {/* Carte du formulaire */}
        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Champ Identifiant */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Identifiant
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="Entrez l'identifiant"
                required
                className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* Champ Nom */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Entrez le nom"
                required
                className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* Champ Poste */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Poste / Fonction
              </label>
              <input
                type="text"
                name="poste"
                value={formData.poste}
                onChange={handleChange}
                placeholder="Entrez le poste"
                required
                className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-950 border border-red-800 text-red-400 px-5 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            {/* Message de succès */}
            {success && (
              <div className="bg-emerald-950 border border-emerald-800 text-emerald-400 px-5 py-3 rounded-2xl text-sm">
                ✅ Contact ajouté avec succès !
              </div>
            )}

            {/* Bouton d'envoi */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 
                ${isLoading 
                  ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-500/30'
                }`}
            >
              {isLoading ? 'Envoi en cours...' : 'Ajouter le contact'}
            </button>
          </form>
        </div>

        {/* Info en bas */}
        <p className="text-center text-slate-500 text-sm mt-8">
          Application Docker Compose • Formulaire de création
        </p>
      </div>
    </div>
  );
};

export default Formulaire;