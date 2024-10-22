import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [reflection, setReflection] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    const questions = [
        "If you were a house, what architectural style would you embody?",
        "What kind of windows would your house have, and what view would they reveal?",
        "Describe the front door – what color, shape, or material feels like 'you'?",
        "Imagine a room in your house where you feel the safest. What does it look like?",
    ];

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
            generateReflection([...responses, newResponse]);
        }
    };

    const generateReflection = async (responses) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/reflection', { responses });
            setReflection(response.data.reflection);
        } catch (error) {
            console.error('Error generating reflection:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentQuestion]);

    return (
        <div className="App">
            <h1>Self-Reflective House Chatbot</h1>

            {loading ? (
                <p>Generating your poetic reflection...</p>
            ) : reflection ? (
                <div className="reflection-container">
                    <p>{reflection}</p>
                </div>
            ) : (
                <div className="chat-container">
                    <p className="question">{questions[currentQuestion]}</p>
                    <textarea
                        ref={inputRef}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleNextQuestion()}
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
