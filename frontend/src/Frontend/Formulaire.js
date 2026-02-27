import React, { useState } from 'react';

const Formulaire = () => {
  const [formData, setFormData] = useState({ id: '', nom: '', poste: '' });
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/contact';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const response = await fetch('/api/contact', {  // URL relative
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    } catch (error) {
      console.error('Erreur réseau :', error);
      alert('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Formulaire de contact</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="id" style={styles.label}>ID :</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            style={styles.input}
            placeholder="Entrez l'ID"
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="nom" style={styles.label}>Nom :</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            style={styles.input}
            placeholder="Entrez le nom"
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="poste" style={styles.label}>Poste :</label>
          <input
            type="text"
            id="poste"
            name="poste"
            value={formData.poste}
            onChange={handleChange}
            style={styles.input}
            placeholder="Entrez le poste"
            required
          />
        </div>
        <button
          type="submit"
          style={isLoading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Envoi...' : 'Continuer'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px'
  },
  title: {
    color: '#333',
    marginBottom: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
    fontFamily: 'Arial, sans-serif'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  }
};

export default Formulaire;