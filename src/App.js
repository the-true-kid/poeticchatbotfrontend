import React, { useState } from 'react';
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
    const [currentReflectionIndex, setCurrentReflectionIndex] = useState(0);

    const handleNextQuestion = () => {
        const newResponses = [
            ...responses,
            { question: questions[currentQuestion], answer: userInput }
        ];
        setResponses(newResponses);
        setUserInput('');

        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            getReflection(newResponses);
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

    const handleNextReflection = () => {
        if (currentReflectionIndex + 1 < reflection.length) {
            setCurrentReflectionIndex(currentReflectionIndex + 1);
        }
    };

    return (
        <div className="App">
            <h1>Self-Reflective Flow</h1>

            {loading ? (
                <p>Generating your poetic reflection...</p>
            ) : reflection.length > 0 ? (
                <div className="reflection-container">
                    <p>{reflection[currentReflectionIndex]}</p>
                    {currentReflectionIndex + 1 < reflection.length && (
                        <button onClick={handleNextReflection}>Next Reflection</button>
                    )}
                </div>
            ) : (
                <div className="question-container fade-in-out">
                    <p>{questions[currentQuestion]}</p>
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your response here..."
                        rows="3"
                    />
                    <button onClick={handleNextQuestion} disabled={!userInput.trim()}>
                        {currentQuestion + 1 < questions.length ? 'Next' : 'Submit'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
