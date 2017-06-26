"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
// #############################
// Clases de edición de celcdas.
// #############################
// ###################
// Edición de números.
// ###################
var NumericEditorComponent = (function () {
    function NumericEditorComponent() {
        this.cancelBeforeStart = false;
    }
    NumericEditorComponent.prototype.agInit = function (params) {
        this.params = params;
        this.value = this.params.value;
        // only start edit if key pressed is a number, not a letter
        this.cancelBeforeStart = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
    };
    NumericEditorComponent.prototype.getValue = function () {
        return this.value;
    };
    NumericEditorComponent.prototype.isCancelBeforeStart = function () {
        return this.cancelBeforeStart;
    };
    // will reject the number if it greater than 1,000,000
    // not very practical, but demonstrates the method.
    NumericEditorComponent.prototype.isCancelAfterEnd = function () {
        return this.value > 1000000;
    };
    ;
    NumericEditorComponent.prototype.onKeyDown = function (event) {
        if (!this.isKeyPressedNumeric(event)) {
            if (event.preventDefault)
                event.preventDefault();
        }
    };
    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    NumericEditorComponent.prototype.ngAfterViewInit = function () {
        this.input.element.nativeElement.focus();
    };
    NumericEditorComponent.prototype.getCharCodeFromEvent = function (event) {
        event = event || window.event;
        return (typeof event.which == "undefined") ? event.keyCode : event.which;
    };
    NumericEditorComponent.prototype.isCharNumeric = function (charStr) {
        return !!/\d/.test(charStr);
    };
    NumericEditorComponent.prototype.isKeyPressedNumeric = function (event) {
        var charCode = this.getCharCodeFromEvent(event);
        var charStr = String.fromCharCode(charCode);
        return this.isCharNumeric(charStr);
    };
    __decorate([
        core_1.ViewChild('input', { read: core_1.ViewContainerRef }), 
        __metadata('design:type', Object)
    ], NumericEditorComponent.prototype, "input", void 0);
    NumericEditorComponent = __decorate([
        core_1.Component({
            selector: 'numeric-cell',
            template: "<input #input (keydown)=\"onKeyDown($event)\" [(ngModel)]=\"value\">"
        }), 
        __metadata('design:paramtypes', [])
    ], NumericEditorComponent);
    return NumericEditorComponent;
}());
exports.NumericEditorComponent = NumericEditorComponent;
// ############################
// Edición de cadenas de texto.
// ############################
var StringEditorComponent = (function () {
    function StringEditorComponent() {
        this.cancelBeforeStart = false;
    }
    StringEditorComponent.prototype.agInit = function (params) {
        this.params = params;
        this.value = this.params.value;
    };
    StringEditorComponent.prototype.getValue = function () {
        return this.value;
    };
    StringEditorComponent.prototype.onKeyDown = function (event) { };
    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    StringEditorComponent.prototype.ngAfterViewInit = function () {
        this.input.element.nativeElement.focus();
    };
    StringEditorComponent.prototype.getCharCodeFromEvent = function (event) {
        event = event || window.event;
        return (typeof event.which == "undefined") ? event.keyCode : event.which;
    };
    __decorate([
        core_1.ViewChild('input', { read: core_1.ViewContainerRef }), 
        __metadata('design:type', Object)
    ], StringEditorComponent.prototype, "input", void 0);
    StringEditorComponent = __decorate([
        core_1.Component({
            selector: 'string-cell',
            template: "<input #input (keydown)=\"onKeyDown($event)\" [(ngModel)]=\"value\">"
        }), 
        __metadata('design:paramtypes', [])
    ], StringEditorComponent);
    return StringEditorComponent;
}());
exports.StringEditorComponent = StringEditorComponent;
//# sourceMappingURL=editor.component.js.map