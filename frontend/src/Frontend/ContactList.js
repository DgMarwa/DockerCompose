import React, { useState, useEffect } from 'react';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null); // contact en cours d'édition
  const [formData, setFormData] = useState({ id: '', nom: '', poste: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger la liste au montage
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      if (!response.ok) throw new Error('Erreur chargement');
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      setError('Impossible de charger les contacts');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce contact ?')) return;
    try {
      const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erreur suppression');
      // Mettre à jour la liste
      setContacts(contacts.filter(c => c.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      id: contact.identifiant,
      nom: contact.nom,
      poste: contact.poste
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingContact) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/contacts/${editingContact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Erreur mise à jour');
      // Recharger la liste
      await fetchContacts();
      setEditingContact(null);
      setFormData({ id: '', nom: '', poste: '' });
    } catch (err) {
      alert('Erreur lors de la modification');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingContact(null);
    setFormData({ id: '', nom: '', poste: '' });
  };

  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Liste des contacts</h2>

      {/* Formulaire d'édition (caché si aucun contact en édition) */}
      {editingContact && (
        <div style={styles.editForm}>
          <h3>Modifier le contact</h3>
          <form onSubmit={handleUpdate}>
            <div style={styles.inputGroup}>
              <label>ID :</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label>Nom :</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label>Poste :</label>
              <input
                type="text"
                name="poste"
                value={formData.poste}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.button} disabled={isLoading}>
                {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
              <button type="button" onClick={cancelEdit} style={styles.buttonCancel}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tableau des contacts */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID (auto)</th>
            <th>Identifiant</th>
            <th>Nom</th>
            <th>Poste</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact.id}>
              <td>{contact.id}</td>
              <td>{contact.identifiant}</td>
              <td>{contact.nom}</td>
              <td>{contact.poste}</td>
              <td>{new Date(contact.created_at).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => handleEdit(contact)}
                  style={styles.editButton}
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  style={styles.deleteButton}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles (vous pouvez les adapter)
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    color: '#333',
    textAlign: 'center'
  },
  editForm: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #ddd'
  },
  inputGroup: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  buttonCancel: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  },
  th: {
    backgroundColor: '#f2f2f2',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd'
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd'
  },
  editButton: {
    padding: '5px 10px',
    backgroundColor: '#2196F3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    marginRight: '5px',
    cursor: 'pointer'
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '20px'
  }
};

export default ContactList;