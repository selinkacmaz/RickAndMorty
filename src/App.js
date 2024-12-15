import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [data, setData] = useState([]); // API verilerini saklamak için
  const [filteredData, setFilteredData] = useState([]); // Filtrelenmiş veriler
  const [filter, setFilter] = useState(''); // Arama filtresi
  const [sortField, setSortField] = useState(''); // Sıralama
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState(null); // Seçilen karakter
  const [error, setError] = useState(null); 

  const itemsPerPage = 10; // Her sayfada gösterilecek karakter sayısı
  const totalPages = 13; // 25 sayfa alacağımız için toplamda 250 karakter olacak

  useEffect(() => {
    const fetchData = async () => {
      try {
        let allData = [];

        // İlk 25 sayfadan verileri çekiyoruz
        for (let page = 1; page <= totalPages; page++) {
          const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${page}`);
          allData = [...allData, ...response.data.results]; // Gelen veriyi birleştir
        }

        // Veriyi state'lere aktarıyoruz
        setData(allData);
        setFilteredData(allData);
      } catch (err) {
        setError('Veriler yüklenirken bir hata oluştu.');
      }
    };

    fetchData(); // Veriyi çekiyoruz
  }, []);

  const handleFilter = (e) => {
    setFilter(e.target.value);
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Filtre uygulandıktan sonra sayfa 1'e dönsün
  };

  const handleSort = (field) => {
    const sorted = [...filteredData].sort((a, b) => {
      if (a[field] < b[field]) return -1;
      if (a[field] > b[field]) return 1;
      return 0;
    });
    setSortField(field);
    setFilteredData(sorted);
  };

  const paginateData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowClick = (character) => {
    setSelectedCharacter(character); // Karakteri seç
  };

  return (
    <div className="App">
      <h1>Rick and Morty Karakterleri</h1>
      {error && <p className="error">{error}</p>}
      <div className="controls">
        <input
          type="text"
          placeholder="Filtrele (isimle arama)"
          value={filter}
          onChange={handleFilter}
        />
        <button onClick={() => handleSort('name')}>İsme Göre Sırala</button>
        <button onClick={() => handleSort('status')}>Duruma Göre Sırala</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>İsim</th>
            <th>Durum</th>
            <th>Tür</th>
          </tr>
        </thead>
        <tbody>
          {paginateData().map((item, index) => (
            <tr key={item.id} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
              <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
              <td>{item.name}</td>
              <td>{item.status}</td>
              <td>{item.species}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      
      {selectedCharacter && (
        <div className="character-details">
          <h2>Seçilen Karakter: {selectedCharacter.name}</h2>
          <p><strong>Durum:</strong> {selectedCharacter.status}</p>
          <p><strong>Tür:</strong> {selectedCharacter.species}</p>
          <p><strong>Cinsiyet:</strong> {selectedCharacter.gender}</p>
          <p><strong>Konum:</strong> {selectedCharacter.location.name}</p>
          <img src={selectedCharacter.image} alt={selectedCharacter.name} />
        </div>
      )}
    </div>
  );
};

export default App;
