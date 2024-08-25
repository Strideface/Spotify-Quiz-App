import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import { checkAuth } from "../../../util/authentication";
import CustomQuiz from "./components/CustomQuiz";
import CompeteQuiz from "./components/CompeteQuiz";

export default function PlayQuizStage() {
  const { quizData, isAuthenticated, setIsAuthenticated, setQuizStage } =
    useOutletContext();

  // Authentication check
  useEffect(() => {
    setIsAuthenticated(checkAuth());
    if (!isAuthenticated) {
      setQuizStage((prevState) => ({
        ...prevState,
        playQuizStage: false,
        gameTilesStage: true,
      }));
    }
  }, [isAuthenticated, setIsAuthenticated, setQuizStage]);

  // render the relevant component correlating to the game chosen by the user during game tiles stage.
  // else-if because may want to add more games at a later point.
  if (quizData.current.gameId === "CUSTOM") {
    return <CustomQuiz />;
  } else if (quizData.current.gameId === "COMPETE") {
    return <CompeteQuiz />;
  }
}
