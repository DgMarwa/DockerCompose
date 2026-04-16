import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Formulaire from './Frontend/Formulaire';
import ContactList from './Frontend/ContactList';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Ajouter un contact</Link>
        <Link to="/liste">Liste des contacts</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Formulaire />} />
        <Route path="/liste" element={<ContactList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;