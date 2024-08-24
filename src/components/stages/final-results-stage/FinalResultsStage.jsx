import { Button } from "@nextui-org/button";
import Results from "./components/Results";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar } from "@nextui-org/avatar";
import { Badge } from "@nextui-org/badge";

export default function FinalResultsStage() {
  const { quizData, setQuizStage } = useOutletContext();

  // NEED TO RESET THE QUIZ RESULTS HERE OTHERWISE IT WILL REMAIN IF USER PRESSES PLAY AGAIN BUTTON AND CARRY OVER
  console.log(quizData.current)

  const handleOnPress = () => {
    setQuizStage((prevState) => ({
      ...prevState,
      finalResultsStage: false,
      gameTilesStage: true,
    }));
  };

  const percentageScore =
    (quizData.current.quizResults.totalPoints /
      (quizData.current.quizTotalTracks * 2)) *
    100;

  return (
    <motion.div
      className=" flex-col justify-center p-5 mt-20"
      initial={{ x: 2000, opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
    >
      <h1 className=" flex justify-center pb-5 font-semibold underline underline-offset-8 decoration-primary decoration-4 sm:text-sm-screen-2">
        Final Results
      </h1>
      <Results />
      <div className=" flex justify-center m-auto">
        <Badge
          content={percentageScore + "%"}
          color={percentageScore >= 50 ? "success" : "warning"}
          size="lg"
          shape="circle"
        >
          <Avatar
            src={quizData.current.userDetails.image}
            showFallback
            size="lg"
            isBordered
            color="primary"
            radius="sm"
          />
        </Badge>
      </div>
      <motion.div
        className=" flex justify-center max-w-xl m-auto mt-14"
        whileHover={{ scale: 1.2 }}
      >
        <Button
          onPress={handleOnPress}
          size="lg"
          color="primary"
          fullWidth
          className=" font-medium text-mobile-3 sm:text-sm-screen-2"
        >
          Play Again!
        </Button>
      </motion.div>
    </motion.div>
  );
}
