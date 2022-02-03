import {useState} from 'react';
import { fetchQuizQuestions } from './API'

//components
import QuestionCard from './components/QuestionCard';
//types
import {QuestionState,  Difficulty} from './API';
//styles
import { GlobalStyle, Wrapper } from './styles/App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [quizOver, setQuizOver] = useState(true);

  console.log(questions);

  const startTrivia = async () => {
    setLoading(true);
    setQuizOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false)
    
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!quizOver) {
      //users answer
      const answer = e.currentTarget.value;
      //check answer against the correct answer
      const correct = questions[number].correct_answer === answer;
      // add score if answer is correct
      if (correct) setScore (prev => prev + 1);
      //save answer in the array for users answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    //Move on to next question
    const nextQuestion = number +1;
    if (nextQuestion === TOTAL_QUESTIONS) {
      setQuizOver(true);
    } else {
       setNumber(nextQuestion);
    }

  };

  const endTrivia = () => {
    setLoading(false);
    setQuizOver(true);
  }
  
  return (
    <>
    <GlobalStyle/>
    <Wrapper>
      <h1>QUIZ APP</h1>

      {quizOver || userAnswers.length === TOTAL_QUESTIONS ? (
      <button className="start" onClick={startTrivia}>
        Start Quiz
      </button>) : (
      <button className="start" onClick={endTrivia}>
        End Quiz
      </button>)
      }

      {!quizOver ? <p className='score'>Score: {score} </p> : null}
      {loading && <p> Loading Questions ...</p>}

      {  !loading && !quizOver && (
      <QuestionCard
        questionNr={number + 1 }
        totalQuestions = {TOTAL_QUESTIONS}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswers ? userAnswers[number]: undefined}
        callback={checkAnswer}
      /> )}

      {
      !quizOver 
      && !loading 
      && userAnswers.length === number+1 
      && number!== TOTAL_QUESTIONS ? 
      (
      <button className="start" onClick={nextQuestion}>
        Next Question
      </button>
      ): null}

      
    </Wrapper>
    </>
  );
};

export default App;
 