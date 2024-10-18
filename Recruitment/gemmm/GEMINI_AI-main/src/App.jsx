import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const [data, setData] = useState(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchDataFromGeminiProAPI() {
    try {
      if (!inputText) {
        alert("Please enter text!");
        return;
      }
      setLoading(true);
      setError(null);

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(
        `Give me 10 mcq questions level intermediate on topic ${inputText} and in form of json which consists of question, option, and answer.`
      );

      let text = await result.response.text();
      console.log("Raw response text:", text);

      text = text.replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/\n/g, "")
        .trim();

      console.log("Cleaned response text:", text);

      try {
        const parsedData = JSON.parse(text);
        setData(parsedData);
        console.log("Parsed data: ", parsedData);
      } catch (parseError) {
        console.error("JSON Parsing error: ", parseError);
        alert("There was an issue parsing the JSON response. Please check the format.");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Failed to fetch data. Please try again.");
      console.error("fetchDataFromGeminiProAPI error: ", error);
    }
  }

  useEffect(() => {
    console.log("Data updated: ", data);
  }, [data]);

  return (
    <>
      <div className="card">
        <input
          type="text"
          style={{ width: 400 }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        {" | "}
        <button disabled={loading} onClick={fetchDataFromGeminiProAPI}>
          {loading ? "Loading..." : "Go Ahead"}
        </button>
        <hr />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <p>Loading data...</p>}
        {!loading && data ? (
          <Quiz questions={data.questions} /> // Pass the questions array here
        ) : (
          !loading && <p>No quiz data available</p>
        )}
      </div>
    </>
  );
}

const Quiz = ({ questions }) => {
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return <p>No questions available.</p>;
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showScore, setShowScore] = useState(false);
  const [feedback, setFeedback] = useState(""); // State for feedback
  const [isCorrect, setIsCorrect] = useState(null); // State for isCorrect

  const handleAnswerSelect = (selectedOption) => {
    setUserAnswer(selectedOption);
  };

  const handleSubmitAnswer = () => {
    const correctAnswer = questions[currentQuestionIndex].answer;
    const isCorrectAnswer = userAnswer === correctAnswer;

    setIsCorrect(isCorrectAnswer);

    if (isCorrectAnswer) {
      setScore(score + 1);
      setFeedback("Correct!");
    } else {
      setFeedback(`Wrong! The correct answer is: ${correctAnswer}`);
    }

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setUserAnswer("");
    } else {
      setShowScore(true);
    }
  };

  return (
    <div>
      {showScore ? (
        <div>
          <h1>
            Your Score: {score} / {questions.length}
          </h1>
        </div>
      ) : (
        <div>
          <h2>{questions[currentQuestionIndex]?.question || "Question not found"}</h2>
          <div>
            {questions[currentQuestionIndex]?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                style={{
                  backgroundColor: userAnswer === option ? "lightgray" : "gray",
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <button onClick={handleSubmitAnswer} disabled={!userAnswer}>
            Submit Answer
          </button>
          {feedback && (
            <p style={{ color: isCorrect ? "green" : "red" }}>{feedback}</p>
          )}{" "}
          {/* Display feedback with dynamic color */}
        </div>
      )}
    </div>
  );
};

export default App;
