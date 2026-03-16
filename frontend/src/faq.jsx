import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const questions = [
    {
      category: 'LOCALIZAÇÃO',
      question: 'Onde fica localizada a ZPE?',
      answer: 'A ZPE Piauí está localizada em Parnaíba, no litoral do estado.',
    },
    {
      category: 'SERVIÇOS',
      question: 'Como faço para entrar em contato?',
      answer: 'Você pode entrar em contato conosco através do e-mail contato@zpepiaui.pi.gov.br ou pelo telefone (86) 3323-1234.',
    },
    {
      category: 'INFORMAÇÕES',
      question: 'Quais as vantagens de se instalar na ZPE?',
      answer: 'As empresas instaladas em ZPE contam com suspensão de impostos federais na importação e na aquisição no mercado interno de bens de capital e de matérias-primas.',
    },
  ];

  return (
    <section>
      <h1 className="title">PERGUNTAS FREQUENTES</h1>
      <h5 className="subtitle">Encontre abaixo as respostas para as perguntas mais frequentes. Se não encontrar o que procura, entre em contato conosco.</h5>
      
      <div className="search-container">
        <input type="text" className="search-input" placeholder="Pesquise sua dúvida..." />
        <i className="fas fa-search"></i>
      </div>

      <div className="questions-container">
        {questions.map((item, index) => (
          <div key={index} className="question">
            <h3 className="category-title">{item.category}</h3>
            <button onClick={() => toggleQuestion(index)}>
              <span>{item.question}</span>
              <i className={`fas fa-chevron-down d-arrow ${activeIndex === index ? 'rotate' : ''}`}></i>
            </button>
            <p className={activeIndex === index ? 'show' : ''}>{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
