import React, { useEffect, useState } from "react";

function QuestionList() {
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => console.error("Error fetching data: ", error));
  }, []);

  const deleteQuestion = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/questions/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        const updatedQuestions = questions.filter(question => question.id !== id);
        setQuestions(updatedQuestions);
      } else {
        console.error('Failed to delete the question');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCorrectAnswerChange = async (questionId, newCorrectIndex) => {
    try {
      const response = await fetch(`http://localhost:4000/questions/${questionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correctIndex: newCorrectIndex }),
      });

      if (response.ok) {
        setQuestions(questions.map(question => 
          question.id === questionId ? { ...question, correctIndex: newCorrectIndex } : question
        ));
      } else {
        console.error('Failed to update the question');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questions.map(question => (
          <li key={question.id}>
            <h2>{question.prompt}</h2>
            <select
              value={question.correctIndex}
              onChange={(e) => handleCorrectAnswerChange(question.id, parseInt(e.target.value))}
            >
              {question.answers.map((answer, index) => (
                <option key={index} value={index}>{answer}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;
