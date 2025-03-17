import React, { useState } from 'react';
import '../../css/slideshow-popup.css';

const SlideshowPopup = ({ initialQuestions, answerChoices, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0); // Track current slide
  const [answersResponse, setAnswersResponse] = useState({}); // Track responses

  const handleAnswerSelect = (choice) => {
    setAnswersResponse((prevResponse) => ({
      ...prevResponse,
      [initialQuestions[currentSlide].keyword]: choice, // Map the keyword to the selected choice
    }));
  };

  const goToNextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, initialQuestions.length - 1));
  const goToPrevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  const handleFinish = () => {
    console.log('Recorded Answers:', answersResponse);
    onClose({ selectedColumns: answersResponse, cancel: false });
  };

  const handleCancel = () => {
    console.log('Cancelled');
    onClose({ selectedAnswers: {}, cancel: true });
  };

  const isNextEnabled = () => {
    return answersResponse[initialQuestions[currentSlide].keyword] !== undefined;
  };

  return (
    <div className="slideshow-overlay">
      <div className="slideshow-container">
        <div className="question-slide">
          <h2>Question {currentSlide + 1}</h2>
          <p>{initialQuestions[currentSlide].question}</p>
          <form className="answer-choices">
            {answerChoices.map((choice, index) => (
              <label key={index} className="choice-label">
                <input
                  type="radio"
                  name={`question-${currentSlide}`}
                  value={choice}
                  checked={answersResponse[initialQuestions[currentSlide].keyword] === choice}
                  onChange={() => handleAnswerSelect(choice)}
                />
                {choice}
              </label>
            ))}

            {/* Dynamically render N/A option with correct state management */}
            <label className="choice-label">
              <input
                type="radio"
                name={`question-${currentSlide}`}
                value="N/A"
                checked={answersResponse[initialQuestions[currentSlide].keyword] === 'N/A'}
                onChange={() => handleAnswerSelect('N/A')}
              />
              N/A
            </label>
          </form>

          <div className="navigation">
            {/* Previous button */}
            <button 
              onClick={goToPrevSlide} 
              disabled={currentSlide === 0}
            >
              Previous
            </button>

            {/* Next button only appears if we're not on the last question */}
            {currentSlide < initialQuestions.length - 1 && (
              <button
                onClick={goToNextSlide}
                disabled={!isNextEnabled()} // Only enable if an answer is selected
              >
                Next
              </button>
            )}

            {/* Finish button only appears on the last question */}
            {currentSlide === initialQuestions.length - 1 && (
              <button 
                onClick={handleFinish} 
                disabled={answersResponse[initialQuestions[currentSlide].keyword] === undefined}
              >
                Finish
              </button>
            )}

            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideshowPopup;
