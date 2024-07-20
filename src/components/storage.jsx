import React, { useState } from 'react';
import '../CSS/form.css';
import categoriesData from '../data/categories.json';
import ReactMarkdown from 'react-markdown';

const InfrastructureForm = () => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [formData, setFormData] = useState({});
  const [res, setRes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);

  const handleInputChange = (categoryId, subcategoryId, questionId, value) => {
    setFormData(prevData => ({
      ...prevData,
      [categoryId]: {
        ...prevData[categoryId],
        [subcategoryId]: {
          ...prevData[categoryId]?.[subcategoryId],
          [questionId]: value
        }
      }
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/infragen_app/submit-form/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setRes(data);
      setShow(true);
      addToConversationHistory(data.response); // Add initial response to conversation history
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(res.response);
  };

  const addToConversationHistory = (message) => {
    setConversationHistory(prevHistory => [...prevHistory, message]);
  };

  const handleUserInputSubmit = () => {
    addToConversationHistory(`User: ${userInput}`);
    setUserInput(''); // Clear user input box after submission
    // Here you could optionally send `userInput` to backend for further processing
  };

  const renderQuestion = (category, subcategory, question) => {
    const { id: categoryId } = category;
    const { id: subcategoryId } = subcategory;
    const { id: questionId, label, type, options, otherOption } = question;

    switch (type) {
      case 'radio':
      case 'checkbox':
        return (
          <div className="question">
            <p>{label}</p>
            <div className="options">
              {options.map(option => (
                <label key={option} className="option">
                  <input
                    type={type}
                    name={`${categoryId}-${subcategoryId}-${questionId}`}
                    value={option}
                    checked={type === 'radio'
                      ? formData[categoryId]?.[subcategoryId]?.[questionId] === option
                      : formData[categoryId]?.[subcategoryId]?.[questionId]?.includes(option)}
                    onChange={(e) => {
                      if (type === 'radio') {
                        handleInputChange(categoryId, subcategoryId, questionId, e.target.value);
                      } else {
                        const currentValues = formData[categoryId]?.[subcategoryId]?.[questionId] || [];
                        const newValues = e.target.checked
                          ? [...currentValues, option]
                          : currentValues.filter(v => v !== option);
                        handleInputChange(categoryId, subcategoryId, questionId, newValues);
                      }
                    }}
                  />
                  {option}
                </label>
              ))}
              {otherOption && (
                <label className="option">
                  <input
                    type={type}
                    name={`${categoryId}-${subcategoryId}-${questionId}`}
                    value="Other"
                    checked={type === 'radio'
                      ? formData[categoryId]?.[subcategoryId]?.[questionId] === 'Other'
                      : formData[categoryId]?.[subcategoryId]?.[questionId]?.includes('Other')}
                    onChange={(e) => {
                      if (type === 'radio') {
                        handleInputChange(categoryId, subcategoryId, questionId, e.target.checked ? 'Other' : '');
                      } else {
                        const currentValues = formData[categoryId]?.[subcategoryId]?.[questionId] || [];
                        const newValues = e.target.checked
                          ? [...currentValues, 'Other']
                          : currentValues.filter(v => v !== 'Other');
                        handleInputChange(categoryId, subcategoryId, questionId, newValues);
                      }
                    }}
                  />
                  Other
                  {((type === 'radio' && formData[categoryId]?.[subcategoryId]?.[questionId] === 'Other') ||
                    (type === 'checkbox' && formData[categoryId]?.[subcategoryId]?.[questionId]?.includes('Other'))) && (
                      <input
                        type="text"
                        className="other-input"
                        value={formData[categoryId]?.[subcategoryId]?.[`${questionId}-other`] || ''}
                        onChange={(e) => handleInputChange(categoryId, subcategoryId, `${questionId}-other`, e.target.value)}
                      />
                    )}
                </label>
              )}
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="question">
            <p>{label}</p>
            <input
              type="text"
              value={formData[categoryId]?.[subcategoryId]?.[questionId] || ''}
              onChange={(e) => handleInputChange(categoryId, subcategoryId, questionId, e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="infrastructure-form">
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader"></div>
          <div className="loader-message">Creating a personalized infrastructure plan...</div>
        </div>
      )}
      {res && show && (
        <div className="response-overlay">
          <div className="response-content">
            <div className="response-header">
              <button className="copy-button" onClick={handleCopy}>Copy</button>
              <button className="close-button" onClick={() => setShow(false)}>X</button>
            </div>
            <ReactMarkdown skipHtml>{res.response}</ReactMarkdown>
            <div className="conversation">
              {conversationHistory.map((message, index) => (
                <div key={index} className="message">{message}</div>
              ))}
            </div>
            <div className="user-input">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your response or change here..."
              />
              <button onClick={handleUserInputSubmit}>Send</button>
            </div>
          </div>
        </div>
      )}
      <div className="sidebar">
        {categoriesData.categories.map((category, index) => (
          <div
            key={category.id}
            className={`sidebar-item ${currentCategory === index ? 'active' : ''}`}
            onClick={() => setCurrentCategory(index)}
          >
            {category.title}
          </div>
        ))}
      </div>
      <div className="main-content">
        <div className="navigation">
          <button
            onClick={() => setCurrentCategory(prev => Math.max(0, prev - 1))}
            disabled={currentCategory === 0}
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (currentCategory === categoriesData.categories.length - 1) {
                handleSubmit();
              } else {
                setCurrentCategory(prev => Math.min(categoriesData.categories.length - 1, prev + 1));
              }
            }}
          >
            {currentCategory === categoriesData.categories.length - 1 ? 'Submit' : 'Next'}
          </button>
          <button onClick={() => setShow(true)}>Show Response</button>
        </div>
        <h2>{categoriesData.categories[currentCategory].title}</h2>
        {categoriesData.categories[currentCategory].subcategories.map(subcategory => (
          <div key={subcategory.id} className="subcategory">
            <h3>{subcategory.title}</h3>
            {subcategory.questions.map(question => renderQuestion(categoriesData.categories[currentCategory], subcategory, question))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfrastructureForm;
