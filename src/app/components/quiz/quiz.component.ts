import { Component } from '@angular/core';
import quiz_questions from '../../data/quiz_questions.json'
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-quiz',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent {
  title: string = '';
  questions: any[] = [];
  questionSelected: any;
  answers: string[] = [];
  answerSelected: string = '';
  questionIndex: number = 0;
  questionMaxIndex: number = 0;
  finished: boolean = false;
  progress: number = 0;

  ngOnInit(): void {
    if(quiz_questions){
      this.finished = false
      this.title = quiz_questions.title

      this.questions = quiz_questions.questions
      this.questionSelected = this.questions[this.questionIndex]

      this.questionIndex = 0
      this.questionMaxIndex = this.questions.length
    }

  }

  playerChoose(value:string){
    this.answers.push(value)
    this.nextStep()
  }

  async nextStep(){
    this.questionIndex+=1

    if(this.questionMaxIndex > this.questionIndex){
      this.questionSelected = this.questions[this.questionIndex]
      this.progress = ((this.questionIndex) / this.questionMaxIndex) * 100;
    }else{
      const finalAnswer:string = await this.checkResult(this.answers)
      this.finished = true
      this.progress = 100;
      this.answerSelected = quiz_questions.results[finalAnswer as keyof typeof quiz_questions.results ]
    }
  }

  async checkResult(anwsers:string[]){

    const result = anwsers.reduce((previous, current, i, arr)=>{
      if(
        arr.filter(item => item === previous).length >
        arr.filter(item => item === current).length
      ){
        return previous
      }else{
        return current
      }
    })

    return result
  }
}
