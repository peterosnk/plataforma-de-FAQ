import React, { useState } from 'react';
import './Dashboard.css';

const AddFaqModal = ({ faq, onClose, onSave }) => {
    // Se houver 'faq', estamos no modo de edição
    const isEdit = !!faq;

    const [formData, setFormData] = useState({
        pergunta: faq?.pergunta || '',
        descricao: faq?.descricao || '',
        solucao: faq?.solucao || ''
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Formato não suportado. Use JPEG, JPG, PNG ou MP4.');
                setFile(null);
                e.target.value = null;
                return;
            }
            // Limite de 100MB (100 * 1024 * 1024 bytes)
            if (selectedFile.size > 100 * 1024 * 1024) {
                setError('O arquivo excede o limite de 100MB.');
                setFile(null);
                e.target.value = null;
                return;
            }
            setError('');
            setFile(selectedFile);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (error) return;
        
        // Passamos o arquivo separadamente ou dentro de um objeto
        onSave(isEdit ? faq.id : null, { ...formData, midia: file });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content profile-card">
                <header className="profile-header">
                    <h2 className="title">{isEdit ? 'Editar Pergunta' : 'Nova Pergunta'}</h2>
                    <p className="subtitle">
                        {isEdit ? 'Atualize as informações do FAQ' : 'Cadastre uma nova dúvida no FAQ'}
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label htmlFor="pergunta">Pergunta</label>
                        <input
                            type="text"
                            id="pergunta"
                            name="pergunta"
                            value={formData.pergunta}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Como resetar minha senha?"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="descricao">Descrição (Opcional)</label>
                        <textarea
                            id="descricao"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            placeholder="Breve descrição sobre a dúvida"
                            rows="3"
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #0d4a8333', outline: 'none' }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="solucao">Solução / Resposta</label>
                        <textarea
                            id="solucao"
                            name="solucao"
                            value={formData.solucao}
                            onChange={handleChange}
                            required
                            placeholder="Passo a passo da solução"
                            rows="5"
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #0d4a8333', outline: 'none' }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="midia">Anexar Foto ou Vídeo (Opcional)</label>
                        <input
                            type="file"
                            id="midia"
                            name="midia"
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.mp4"
                            style={{ padding: '10px', fontSize: '14px' }}
                        />
                        {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{error}</p>}
                        <p style={{ color: '#666', fontSize: '11px', marginTop: '5px' }}>
                            Formatos aceitos: JPG, PNG, MP4. Limite: 100MB.
                        </p>
                    </div>

                    <div className="profile-actions">
                        <button type="submit" className="profile-button save">
                            {isEdit ? 'Salvar Alterações' : 'Criar FAQ'}
                        </button>
                        <button type="button" className="profile-button cancel" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFaqModal;
