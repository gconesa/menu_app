import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
})
export class RecipePage implements OnInit {
  recipe;
  title;
  constructor(private mdlController: ModalController) { }

  ngOnInit() {
    let titleArray = this.recipe.titulo.split(' ');
    let firstPart = "";
    for (let index = 0; index < Math.floor((titleArray.length/2)); index++) {
      const word = titleArray[index];
      firstPart = `${firstPart} ${word}`
    }
    let secondPart = "<span>"
    
    for (let index = Math.floor(titleArray.length/2); index <  titleArray.length; index++) {
      const word = titleArray[index];
      secondPart = `${secondPart} ${word}`;
    }
    secondPart = `${secondPart}</span>`;
    this.title = `${firstPart} ${secondPart}`;
       
 
  }

  close() {
    this.mdlController.dismiss();
  }

}
