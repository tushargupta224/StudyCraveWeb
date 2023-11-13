import type Question from "./question";

export default interface Quiz {
  questionarre: Question[];
  timer?: string;
}
