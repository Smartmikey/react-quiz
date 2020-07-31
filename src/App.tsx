import React, {useState} from 'react';
import QuestionCard from './components/QuestionCard'
import {fetchQuizQuestions, QuestionState, Difficulty} from './API'
//  styles
import {GlobalStyle, Wrapper} from './App.style'
const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}
const App =() => {


  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswer, setUserAnswer] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver]= useState(true);

  console.log( questions);
  
  const startTrivia = async () =>{
    setLoading(true);
    setGameOver(false);

    const newQuestion = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setQuestions(newQuestion);

    setScore(0);
    setUserAnswer([]);
    setNumber(0);
    setLoading(false)
  }
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) =>{
    if(!gameOver){
      // users answer
      const answer = e.currentTarget.value
      
      // check answer angainst correct answer
      
      const correct = questions[number].correct_answer === answer;

      // add score if answer is correct
      if(correct) setScore(prev => prev + 1)

      // save answer in the array for user Answers

      const answerObject = {
        question : questions[number],
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswer((prev: any) => [...prev, answerObject])
    }
  }

  const nextQuestion = () =>{
    // move unto next question if !last question

    const nextQuestion = number + 1

    if(nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true);

    }else{
      setNumber(nextQuestion)
    }
  }

  return (
    <React.Fragment>
      <GlobalStyle />
    <Wrapper>
      <h1>React Quiz</h1>
      {
        gameOver || userAnswer.length === TOTAL_QUESTIONS ?
      (<button className="start" onClick={startTrivia}>
      Start
    </button>) : null 
    }
     {!gameOver ?  (<p className="score">Score: {score} </p>): null}
     {loading ? <p > Loading Questions ...</p>: null}

     {!loading && !gameOver ?(
      <QuestionCard 
        questionNr={number +1}
        totalQuestion={TOTAL_QUESTIONS}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswer ? userAnswer[number] : undefined}
        callback={checkAnswer}
      />

      )
      : null
      }

      {
        !gameOver && !loading && userAnswer.length === number + 1 && number !== TOTAL_QUESTIONS - 1?
        (<button className="next" onClick={nextQuestion}>
        Next Question  
      </button>) : null

      }
      
    </Wrapper>
    </React.Fragment>
  ) 
  
}

export default App;
