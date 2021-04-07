import { Component } from '@angular/core';
import {ModalController } from '@ionic/angular';

import * as XLSX from 'xlsx';
import { RecipePage } from '../recipe/recipe.page';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.page.html',
  styleUrls: ['menu.page.scss']
})
export class MenuPage {
  categories =[];
  types = [];
  typeSelected = null;
  categorySelected = null;
  recipes =  null;
  recipesSelected = [];
  menu = null;
  columns = ["A","B","C","D","E","F"];
  optionsCarrouselRecipes = {
    slidesPerView: 1.3,
    spaceBetween: 10,
    freeMode: true,
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1.3,
        spaceBetween: 20
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 2.3,
        spaceBetween: 30
      },
      // when window width is >= 640px
      900: {
        slidesPerView: 3.3,
        spaceBetween: 40
      }
    }
  };

  optionsSliderTypes = {
    slidesPerView: 3,
    spaceBetween: 7,
    freeMode: true,

    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 2.2,
        spaceBetween: 7
      },
      // when window width is >= 480px
      // when window width is >= 640px
      640: {
        slidesPerView: 6.3,
        spaceBetween: 10
      },
      920: {
        slidesPerView: 8.3,
        spaceBetween: 10
      }
    }
  };
  constructor(private mdlController: ModalController) {  
  }
  
  async ngOnInit() {
    this.menu = await this.readFirstSheet("assets/menu/menu.xlsx");
    console.log(this.menu);
    let sheets = this.menu.SheetNames;
    this.categories = [];
    this.types = [];
    sheets.forEach(sheetName => {
       let category =  {
          name: sheetName,
          recipes: [],
          types: []
        };

        let recipeis = this.menu.Sheets[sheetName];
        let exist = true;
        let count = 2;
        while (exist) {
          let recipe = {
            seccion: null,
            titulo: null,
            descripcion_corta: null,
            descripcion_larga: null,
            precio: null,
            link_image: null
          };
          for (let indexColumn = 0; indexColumn <  this.columns.length; indexColumn++) {
            const column = this.columns[indexColumn];
            if (recipeis.hasOwnProperty(`B${count}`)) {
              const cell = recipeis[`${column}${count}`];
              if (column === "A" && cell) {
                let seccion =cell.v;
                let indexExiste = category.types.findIndex((t: any) => t === seccion);
                if (indexExiste<0) {
                  category.types.push(seccion);
                }
                recipe.seccion = seccion;
              } else  if (column === "B" && cell) {
                recipe.titulo = cell.v;
              } else  if (column === "C" && cell) {
                recipe.descripcion_corta = cell.v;
              } else  if (column === "D" && cell) {
                recipe.descripcion_larga = cell.v;
              } else  if (column === "E" && cell) {
                recipe.precio = cell.v;
              } else  if (column === "F" && cell) {
                recipe.link_image = cell.v;
              }
            } else {
              exist = false;
              break;
            }
          }
         
          if (exist) {
            category.recipes.push(recipe);
            count++;
          }
        }
          

        this.categories.push(category);
        this.categorySelected = this.categories[0].name;
        this.recipes = this.categories[0].recipes;
        this.types = this.categories[0].types;
        this.typeSelected = this.types[0];
        this.recipesSelected = this.recipes.filter((r: any) => r.seccion === this.typeSelected);
    });

  }


  changeCategory(category) {
    const index = this.categories.findIndex((c: any) => c.name === category);
    if (index>=0) {
      this.categorySelected = null;
      this.types = [];
      this.typeSelected = null;
      this.recipesSelected = [];
      setTimeout(() => {
        this.categorySelected = this.categories[index].name;
        this.recipes = this.categories[index].recipes;
        this.types = this.categories[index].types;
        this.typeSelected = this.types[0];
        this.recipesSelected = this.recipes.filter((r: any) => r.seccion === this.typeSelected);
      }, 0);
     
    }
  }

  changeType(type) {
    this.typeSelected = type;
    this.recipesSelected = [];
    setTimeout(() => {
      this.recipesSelected = this.recipes.filter((r: any) => r.seccion === type);
    },0);
  }

  readFirstSheet(url: any) {

    return new Promise<any>((resolve, reject) => {
      let workbook;
      let oReq = new XMLHttpRequest();
      oReq.open("GET", url, true);
      oReq.responseType = "arraybuffer";
      oReq.onload = function(e) {
        var arraybuffer = oReq.response;
        var data = new Uint8Array(arraybuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        workbook = XLSX.read(bstr, {type:"binary"});
        /* do the work with xls here */
        return resolve(workbook);
      }
      oReq.send();
    });
  }

  search(event) {
    if (event.detail && event.detail.value && event.detail.value != '') {
      this.typeSelected = null;
      this.categorySelected = null;
      let word = event.detail.value.toLowerCase().trim();
      this.recipesSelected = [];
      console.log(word);
      this.categories.forEach((c: any) => {
        let recipes = c.recipes.filter((r: any) => r.titulo.toLowerCase().trim().includes(word) || (r.descripcion_corta && r.descripcion_corta.toLowerCase().trim().includes(word)) || (r.descripcion_larga && r.descripcion_larga.toLowerCase().trim().includes(word)));
        this.recipesSelected = this.recipesSelected.concat(recipes);
      });
      
    } else {
      this.categorySelected = this.categories[0].name;
      this.recipes = this.categories[0].recipes;
      this.types = this.categories[0].types;
      this.typeSelected = this.types[0];
      this.recipesSelected = this.recipes.filter((r: any) => r.seccion === this.typeSelected);
    }
  }

  async showRecipe(recipe) {
    const modal = await this.mdlController.create({
      component: RecipePage,
      componentProps: {
       recipe
      }
    });
    await modal.present();
  }

}
