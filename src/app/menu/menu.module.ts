import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuPage } from './menu.page';

import { MenuPageRoutingModule } from './menu-routing.module';
import { RecipePageModule } from '../recipe/recipe.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MenuPageRoutingModule,
    RecipePageModule,
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
