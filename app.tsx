import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './App.css';

interface Phone {
  id?: number;
  marka: string;
  szin: string;
  tarhely: string;
}

function App() {
  const [phones, setPhone] = useState<Phone[]>([]);
  const [newPhone, setNewPhone] = useState<Phone>({ marka: "", szin: "", tarhely: "" });

  useEffect(() => {
    fetchPhones();
  }, []);

  const fetchPhones = async () => {
    try {
      const response = await axios.get('http://localhost:3000/telefonok');
      setPhone(response.data);
    } catch (error) {
      console.error("Error, nem fetchelhető!", error);
    }
  };

  const addPhone = async (e: FormEvent) => {
    e.preventDefault();
    const { marka, szin, tarhely } = newPhone;
    if (!marka || !szin || !tarhely) return;

    try {
      const response = await axios.post('http://localhost:3000/telefonok', newPhone);
      setPhone([...phones, { ...newPhone, id: response.data.id }]);
      setNewPhone({ marka: "", szin: "", tarhely: "" });
    } catch (error) {
      console.error("Error, nem adható hozzá telefon.!", error);
    }
  };

  const InputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPhone({ ...newPhone, [name]: value });
  };

  return (
    <div className="App">
      <h1>Telefon Lista</h1>
      <form onSubmit={addPhone}>
        <input 
          type="text" 
          name="marka" 
          value={newPhone.marka} 
          onChange={InputChange} 
          placeholder="Márka" 
        />
        <input 
          type="text" 
          name="szin" 
          value={newPhone.szin} 
          onChange={InputChange} 
          placeholder="Szín" 
        />
        <input 
          type="text" 
          name="tarhely" 
          value={newPhone.tarhely} 
          onChange={InputChange} 
          placeholder="Tárhely" 
        />
        <button type="submit">Hozzáadás</button>
      </form>
      <ul>
        {phones.map((phone) => (
          <li key={phone.id}>
            {phone.marka} - {phone.szin} - {phone.tarhely}GB
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
