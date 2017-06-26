import {Component, ViewContainerRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import {CommonModule} from "@angular/common";
//import {CalendarModule} from 'primeng/primeng';

// Componentes de ag-grid.
import {GridOptions} from 'ag-grid/main';
import {AgRendererComponent} from 'ag-grid-ng2/main';
import {AgEditorComponent} from 'ag-grid-ng2/main';

// #############################
// Clases de edición de celcdas.
// #############################

// ###################
// Edición de números.
// ###################

@Component({
    selector: 'numeric-cell',
    template: `<input #input (keydown)="onKeyDown($event)" [(ngModel)]="value">`
})
export class NumericEditorComponent implements AgEditorComponent,
                                               AfterViewInit {
    private params:any;
    private value:number;
    private cancelBeforeStart:boolean = false;


    @ViewChild('input', {read: ViewContainerRef}) private input;

    agInit(params:any):void {
        this.params = params;
        this.value = this.params.value;

        // only start edit if key pressed is a number, not a letter
          this.cancelBeforeStart = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
    }

    getValue():any {
        return this.value;
    }

    isCancelBeforeStart():boolean {
        return this.cancelBeforeStart;
    }

    // will reject the number if it greater than 1,000,000
    // not very practical, but demonstrates the method.
    isCancelAfterEnd(): boolean {
        return this.value > 1000000;
    };

    onKeyDown(event):void {

        if (!this.isKeyPressedNumeric(event)) {
            if (event.preventDefault) event.preventDefault();
        }
    }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        this.input.element.nativeElement.focus();
    }

    private getCharCodeFromEvent(event):any {
        event = event || window.event;
        return (typeof event.which == "undefined") ? event.keyCode : event.which;
    }

    private isCharNumeric(charStr):boolean {
        return !!/\d/.test(charStr);
    }

    private isKeyPressedNumeric(event):boolean {
        var charCode = this.getCharCodeFromEvent(event);
        var charStr = String.fromCharCode(charCode);
        return this.isCharNumeric(charStr);
    }
}

// ############################
// Edición de cadenas de texto.
// ############################

@Component({
    selector: 'string-cell',
    template: `<input #input (keydown)="onKeyDown($event)" [(ngModel)]="value">`
})
export class StringEditorComponent implements AgEditorComponent,
                                               AfterViewInit {
    private params:any;
    private value:number;
    private cancelBeforeStart:boolean = false;
    //pattern: string = "[a-z]" ;

    @ViewChild('input', {read: ViewContainerRef}) private input;

    agInit(params:any):void {
        this.params = params;
        this.value = this.params.value;
    }

    getValue():any {
        return this.value;
    }

    onKeyDown(event):void { }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        this.input.element.nativeElement.focus();
    }

    private getCharCodeFromEvent(event):any {
        event = event || window.event;
        return (typeof event.which == "undefined") ? event.keyCode : event.which;
    }
}
