import { NgModule } from '@angular/core';
import { ParallaxModule } from 'ngx-parallax';
import { MzSidenavModule } from 'ngx-materialize';
import { MzDropdownModule } from 'ngx-materialize'
import { MatTabsModule } from '@angular/material/tabs';
import { MzToastModule } from 'ngx-materialize';
import { MzFeatureDiscoveryModule } from 'ngx-materialize';
import { MzButtonModule } from 'ngx-materialize';
import { MzSwitchModule } from 'ngx-materialize';
import { MzDatepickerModule } from 'ngx-materialize';
import { MzRadioButtonModule } from 'ngx-materialize'
import { MzModalModule } from 'ngx-materialize'
import { CommonModule } from "@angular/common";
import { MzSelectModule } from 'ngx-materialize';
import { MzInputModule } from 'ngx-materialize';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
        ParallaxModule,
        MzSidenavModule,
        MzDropdownModule,
        MatTabsModule,
        MzToastModule,
        MzButtonModule,
        MzFeatureDiscoveryModule,
        MzSwitchModule,
        MzDatepickerModule,
        MzRadioButtonModule,
        MzModalModule,
        MzSelectModule,
        MzInputModule
    ]
})
export class MaterializeModule {

}