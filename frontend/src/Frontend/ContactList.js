import React, { useState, useEffect } from 'react';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({ 
    id: '', 
    nom: '', 
    poste: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les contacts au montage
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/contacts');
      if (!response.ok) throw new Error('Erreur lors du chargement');
      const data = await response.json();
      setContacts(data);
      setError('');
    } catch (err) {
      setError('Impossible de charger les contacts. Vérifiez votre connexion.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce contact ?')) return;

    try {
      const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erreur suppression');
      
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression du contact');
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      id: contact.identifiant || '',
      nom: contact.nom || '',
      poste: contact.poste || ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingContact) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/contacts/${editingContact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Erreur mise à jour');

      await fetchContacts(); // Recharger la liste
      setEditingContact(null);
      setFormData({ id: '', nom: '', poste: '' });
    } catch (err) {
      alert('Erreur lors de la mise à jour du contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setEditingContact(null);
    setFormData({ id: '', nom: '', poste: '' });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={fetchContacts}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Gestion des Contacts
            </h1>
            <p className="text-slate-400 mt-1">Liste complète de vos contacts</p>
          </div>
          <button
            onClick={fetchContacts}
            disabled={isLoading}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-2 transition"
          >
            <span>↻</span> Actualiser
          </button>
        </div>

        {/* Formulaire d'édition */}
        {editingContact && (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 mb-10 shadow-xl">
            <h3 className="text-2xl font-semibold mb-6 text-white">Modifier le contact</h3>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Identifiant</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-5 py-3 focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Nom complet</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-5 py-3 focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Poste / Fonction</label>
                  <input
                    type="text"
                    name="poste"
                    value={formData.poste}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-5 py-3 focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-medium py-4 rounded-xl transition"
                >
                  {isSubmitting ? 'Mise à jour en cours...' : 'Enregistrer les modifications'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-4 rounded-xl transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tableau des contacts */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800 border-b border-slate-700">
                  <th className="px-6 py-5 text-left text-sm font-medium text-slate-400">ID</th>
                  <th className="px-6 py-5 text-left text-sm font-medium text-slate-400">Identifiant</th>
                  <th className="px-6 py-5 text-left text-sm font-medium text-slate-400">Nom</th>
                  <th className="px-6 py-5 text-left text-sm font-medium text-slate-400">Poste</th>
                  <th className="px-6 py-5 text-left text-sm font-medium text-slate-400">Date de création</th>
                  <th className="px-6 py-5 text-center text-sm font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-16 text-slate-400">
                      Aucun contact trouvé
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-slate-800/50 transition">
                      <td className="px-6 py-5">{contact.id}</td>
                      <td className="px-6 py-5 font-medium">{contact.identifiant}</td>
                      <td className="px-6 py-5">{contact.nom}</td>
                      <td className="px-6 py-5 text-slate-300">{contact.poste}</td>
                      <td className="px-6 py-5 text-sm text-slate-400">
                        {new Date(contact.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(contact)}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium transition"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-medium transition"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-500 text-sm mt-8">
          {contacts.length} contact{contacts.length > 1 ? 's' : ''} • Application Docker Compose
        </p>
      </div>
    </div>
  );
};

export default ContactList;