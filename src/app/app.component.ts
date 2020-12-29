import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

export type Job = {
  company : string;
  contract : string;
  featured : boolean;
  id : number;
  languages : string[];
  level : string;
  logo : string;
  new : boolean;
  position : string;
  postedAt : string;
  role : string;
  tools : string[]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations : [
    trigger('lists',[
      transition('* => *' , [
        query(':enter',style({opacity : 0}),{optional : true}),

        query(':enter' , stagger('200ms',[
          animate('0.7s ease-in',keyframes([
            style({opacity : 0,transform : 'translateY(-100px)',offset : 0}),
            style({opacity : 0.9,transform : 'translateY(35px)',offset : 0.3}),
            style({opacity : 1,transform : 'translateY(0px)',offset : 1})
          ]))
        ]),{optional : true})
      ])
    ]),
    trigger('skills',[
      transition('* => *' , [
        query(':enter',style({opacity : 0}),{optional : true}),

        query(':enter' , stagger('100ms',[
          animate('0.4s ease-in',keyframes([
            style({opacity : 0,transform : 'translateX(-100px)',offset : 0}),
            // style({opacity : 0.9,transform : 'translateY(35px)',offset : 0.3}),
            style({opacity : 1,transform : 'translatex(0px)',offset : 1})
          ]))
        ]),{optional : true}),

        query(':leave',style({opacity : 1}),{optional : true}),

        query(':leave' , stagger('50ms',[
          animate('0.3s ease-in',keyframes([
            style({opacity : 1,transform : 'translateX(0px)',offset : 0}),
            // style({opacity : 0.9,transform : 'translateY(35px)',offset : 0.3}),
            style({opacity : 0,transform : 'translatex(-100px)',offset : 1})
          ]))
        ]),{optional : true})
      ])
    ])
  ]
})
export class AppComponent implements OnInit{
  title = 'job-listing-angular';

  constructor(private http : HttpClient){}
  jobsList : Job[] = [];
  extraArray : Job[] = [];
  unique_skills = [];
  ngOnInit(){
    this.http.get<Job[]>('../assets/json_file/data.json').subscribe(data=>{
      // console.log(data);
      this.jobsList = data;
      this.jobsList.forEach(job=>{
        const alter1 = job.logo.split('').splice(1,job.logo.length-1).join('');
        // console.log(alter1);
        job['logo'] = '../assets'+ alter1;
        // alter1.split().splice(0,'/assets')
        job['languages'] = [job['role'],job['level'],...job['languages'],...job['tools']]
      })
      this.extraArray = this.jobsList;
    })
  }

  selectSkill(skill){
    let h=0;
    this.unique_skills.every((u_skill,index)=>{
      if(u_skill == skill){
        h=1;
        return false;
      }
      // console.log(index);
      return true;
    })
    if(h==0){
      this.unique_skills.push(skill);
      // console.log(this.unique_skills);
      this.checkMainArray();
    }
  }

  checkMainArray(){
    const newArray = [];
    for( let i=0 ; i < this.extraArray.length ; i++ ){
      let r=0;
      for( let j=0 ; j < this.unique_skills.length ; j++ ){
        let h=0;
        for(let k=0 ; k < this.extraArray[i].languages.length ; k++ ){
          if(this.unique_skills[j] == this.extraArray[i].languages[k]){
            h=1;
            break;
          }
        }
        if(h==1){
          r++;
        }
      }
      if(r == this.unique_skills.length){
        newArray.push(this.extraArray[i]);
      }
    }
    this.jobsList = [];
    setTimeout(()=>{
      this.jobsList = newArray;
    },10 )
    // console.log(newArray);
    
  }
  clearSkills(){
    this.unique_skills =[];
    this.jobsList = [];
    setTimeout(()=>{
      this.jobsList = this.extraArray;
    },10)
  }
  removeSkill(index){
    // this.unique_skills.pop();
    for(let i=0 ;i < this.unique_skills.length ; i++){
      if(i == index){
        this.unique_skills.splice(i,1);
        break;
      }
    }
    this.checkMainArray();
  }

}
