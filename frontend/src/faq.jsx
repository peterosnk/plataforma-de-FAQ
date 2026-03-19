import React, { useState, useEffect } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [questions, setQuestions] = useState([]);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  //BUSCA OS DADOS DO BACKEND
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/faqs/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await response.json();

        // adapta os dados do Django pro formato do seu layout
        const formatted = data.map(item => ({
          category: "FAQ",
          question: item.pergunta,
          answer: item.solucao
        }));

        setQuestions(formatted);

      } catch (error) {
        console.error(error);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <section>
      <h1 className="title">PERGUNTAS FREQUENTES</h1>
      <h5 className="subtitle">
        Encontre abaixo as respostas para as perguntas mais frequentes. 
        Se não encontrar o que procura, entre em contato conosco.
      </h5>
      
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

            <p className={activeIndex === index ? 'show' : ''}>
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;