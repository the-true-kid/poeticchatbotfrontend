import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const questions = [
    "If you were a house, what kind would you be?",
    "Describe a color that reflects your current emotional state.",
    "What do you value most in relationships?",
    "Imagine your perfect day – how does it start?",
    "If you could whisper advice to your younger self, what would it be?"
];

function App() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [reflection, setReflection] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    // Trigger the next question on Enter key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && userInput.trim()) {
            handleNextQuestion();
        }
    };

    const handleNextQuestion = () => {
        const newResponse = {
            question: questions[currentQuestion],
            answer: userInput,
        };

        setResponses([...responses, newResponse]);
        setUserInput('');

        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            getReflection([...responses, newResponse]);
        }
    };

    const getReflection = async (responses) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/reflection', { responses });
            const reflectionSentences = response.data.reflection.split('. ').map(sentence => sentence.trim());
            setReflection(reflectionSentences);
        } catch (error) {
            console.error('Error generating reflection:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Auto-focus the input field when a new question appears
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentQuestion]);

    return (
        <div className="App">
            <h1>Self-Reflective Chatbot</h1>

            {loading ? (
                <p>Generating your poetic reflection...</p>
            ) : reflection.length > 0 ? (
                <div className="reflection-container">
                    {reflection.map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>
            ) : (
                <div className="chat-container">
                    <p className="question">{questions[currentQuestion]}</p>
                    <textarea
                        ref={inputRef}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your response here..."
                        rows="3"
                    />
                    <button
                        className="next-button"
                        onClick={handleNextQuestion}
                        disabled={!userInput.trim()}
                    >
                        {currentQuestion + 1 < questions.length ? 'Next' : 'Submit'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
