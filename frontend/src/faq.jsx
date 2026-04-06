import React, { useState, useEffect, useRef } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Olá! Sou o assistente de IA. Como posso te ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) scrollToBottom();
  }, [messages, isTyping, isChatOpen]);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://10.0.0.161:8000/api/chatbot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', content: 'Desculpe, tive um problema ao processar sua dúvida.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Erro de conexão com a IA.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Carregar todos os FAQs do backend
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://10.0.0.161:8000/api/faqs/all/');
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

  const renderMedia = (midiaUrl) => {
    if (!midiaUrl) return null;

    // Ajustar URL se necessário (adicionar o host do backend)
    const fullUrl = midiaUrl.startsWith('http') ? midiaUrl : `http://10.0.0.161:8000${midiaUrl}`;
    const isVideo = midiaUrl.toLowerCase().endsWith('.mp4');

    return (
      <div className="faq-media-container" style={{ marginTop: '15px', textAlign: 'center' }}>
        {isVideo ? (
          <video controls style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '400px' }}>
            <source src={fullUrl} type="video/mp4" />
            Seu navegador não suporta vídeos.
          </video>
        ) : (
          <img 
            src={fullUrl} 
            alt="Mídia da FAQ" 
            style={{ maxWidth: '100%', borderRadius: '8px', cursor: 'pointer', maxHeight: '400px', objectFit: 'contain' }}
            onClick={() => window.open(fullUrl, '_blank')}
          />
        )}
      </div>
    );
  };

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
              <div className={`faq-answer-content ${activeIndex === index ? 'show' : ''}`}>
                  <p>{item.solucao}</p>
                  {renderMedia(item.midia)}
                </div>
            </div>
          ))
        ) : (
          <p style={{textAlign: 'center', color: '#0d4a83'}}>Nenhuma pergunta encontrada.</p>
        )}
      </div>

      {/* Chatbot Widget */}
      <div className="chatbot-container">
        {isChatOpen && (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <h3>Suporte IA</h3>
              <button onClick={() => setIsChatOpen(false)} style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px'}}>×</button>
            </div>
            <div className="chatbot-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.role}`}>
                  {msg.content}
                </div>
              ))}
              {isTyping && <div className="typing-indicator">IA está digitando...</div>}
              <div ref={chatEndRef} />
            </div>
            <form className="chatbot-input-area" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Digite sua dúvida..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        )}
        <button className="chatbot-button" onClick={() => setIsChatOpen(!isChatOpen)}>
          <i className={`fas ${isChatOpen ? 'fa-times' : 'fa-robot'}`}></i>
        </button>
      </div>
    </section>
  );
};

export default FAQ;
