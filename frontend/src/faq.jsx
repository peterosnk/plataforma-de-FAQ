import React, { useState, useEffect } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Carregar todos os FAQs do backend
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/faqs/all/');
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      } else {
        console.error('Erro ao buscar FAQs');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Filtrar perguntas baseado na busca
  const filteredFaqs = faqs.filter(faq =>
    faq.pergunta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="faq">
      <h1 className="title">PERGUNTAS FREQUENTES</h1>
      <h5 className="subtitle">Encontre abaixo as respostas para as perguntas mais frequentes. Se não encontrar o que procura, entre em contato conosco.</h5>
      
      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Pesquise sua dúvida..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="fas fa-search"></i>
      </div>

      <div className="questions-container">
        {loading ? (
          <p style={{textAlign: 'center', color: '#0d4a83'}}>Carregando perguntas...</p>
        ) : filteredFaqs.length > 0 ? (
          filteredFaqs.map((item, index) => (
            <div key={item.id} className="question">
              {/* Note: O campo 'category' não existe no banco atual, então deixaremos fixo ou vazio se preferir */}
              <button onClick={() => toggleQuestion(index)}>
                <span>{item.pergunta}</span>
                <i className={`fas fa-chevron-down d-arrow ${activeIndex === index ? 'rotate' : ''}`}></i>
              </button>
              <p className={activeIndex === index ? 'show' : ''}>{item.solucao}</p>
            </div>
          ))
        ) : (
          <p style={{textAlign: 'center', color: '#0d4a83'}}>Nenhuma pergunta encontrada.</p>
        )}
      </div>
    </section>
  );
};

export default FAQ;
