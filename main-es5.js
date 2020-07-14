function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"], {
  /***/
  "../ng-eventstore-listing/src/environments/environment.ts":
  /*!****************************************************************!*\
    !*** ../ng-eventstore-listing/src/environments/environment.ts ***!
    \****************************************************************/

  /*! exports provided: environment */

  /***/
  function ngEventstoreListingSrcEnvironmentsEnvironmentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "environment", function () {
      return environment;
    }); // This file can be replaced during build by using the `fileReplacements` array.
    // `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
    // The list of file replacements can be found in `angular.json`.
    // NOTE: get the environments from process.env of docker-compose. currently hardcoded per environment.ts


    var environment = {
      production: false,
      pushHost: 'http://localhost:3000',
      // profileHost: 'http://localhost:3002',
      vehicleHost: 'http://localhost:3000'
    };
    /*
     * For easier debugging in development mode, you can import the following file
     * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
     *
     * This import should be commented out in production mode because it will have a negative impact
     * on performance if an error is thrown.
     */
    // import 'zone.js/dist/zone-error';  // Included with Angular CLI.

    /***/
  },

  /***/
  "../ng-eventstore-listing/src/lib/components/item-template-holder/item-template-holder.component.ts":
  /*!**********************************************************************************************************!*\
    !*** ../ng-eventstore-listing/src/lib/components/item-template-holder/item-template-holder.component.ts ***!
    \**********************************************************************************************************/

  /*! exports provided: ItemTemplateHolderComponent */

  /***/
  function ngEventstoreListingSrcLibComponentsItemTemplateHolderItemTemplateHolderComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ItemTemplateHolderComponent", function () {
      return ItemTemplateHolderComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _directives_template_directive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ../../directives/template.directive */
    "../ng-eventstore-listing/src/lib/directives/template.directive.ts");

    function ItemTemplateHolderComponent_ng_template_2_Template(rf, ctx) {}

    var ItemTemplateHolderComponent = /*#__PURE__*/function () {
      function ItemTemplateHolderComponent(componentFactoryResolver) {
        _classCallCheck(this, ItemTemplateHolderComponent);

        this.componentFactoryResolver = componentFactoryResolver;
        this.data = {};
        this.lookups = {};
        this.updateEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.updateLookupsEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.showModalEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.deleteEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
      }

      _createClass(ItemTemplateHolderComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {// this.loadComponent();
        }
      }, {
        key: "ngAfterViewInit",
        value: function ngAfterViewInit() {
          this.loadComponent();

          if (this.initialChanges) {
            this.ngOnChanges(this.initialChanges);
            this.initialChanges = undefined;
          }
        }
      }, {
        key: "ngOnChanges",
        value: function ngOnChanges(changes) {
          var self = this;

          if (self.componentRef) {
            var changesKeys = Object.keys(changes);
            changesKeys.forEach(function (key) {
              self.componentRef.instance[key] = changes[key].currentValue;
            });
            self.componentRef.instance.ngOnChanges(changes);
          } else {
            this.initialChanges = changes;
          }
        }
      }, {
        key: "loadComponent",
        value: function loadComponent() {
          var componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.itemComponentClass);
          var viewContainerRef = this.itemHost.viewContainerRef;
          viewContainerRef.clear();
          this.componentRef = viewContainerRef.createComponent(componentFactory);
          this.componentRef.instance.data = this.data;
          this.componentRef.instance.onUpdateEmitter = this.updateEmitter;
          this.componentRef.instance.onUpdateLookupsEmitter = this.updateLookupsEmitter;
          this.componentRef.instance.onShowModalEmitter = this.showModalEmitter;
          this.componentRef.instance.onDeleteEmitter = this.deleteEmitter; // (this.componentRef.instance as ItemTemplateComponent).idPropertyName = this.idPropertyName;

          this.componentRef.instance.lookups = this.lookups;
          this.componentRef.instance.ngOnInit();
        }
      }]);

      return ItemTemplateHolderComponent;
    }();

    ItemTemplateHolderComponent.ɵfac = function ItemTemplateHolderComponent_Factory(t) {
      return new (t || ItemTemplateHolderComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]));
    };

    ItemTemplateHolderComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: ItemTemplateHolderComponent,
      selectors: [["lib-item-template-holder"]],
      viewQuery: function ItemTemplateHolderComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_directives_template_directive__WEBPACK_IMPORTED_MODULE_1__["TemplateDirective"], true);
        }

        if (rf & 2) {
          var _t;

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.itemHost = _t.first);
        }
      },
      inputs: {
        itemComponentClass: "itemComponentClass",
        data: "data",
        lookups: "lookups"
      },
      outputs: {
        updateEmitter: "updateEmitter",
        updateLookupsEmitter: "updateLookupsEmitter",
        showModalEmitter: "showModalEmitter",
        deleteEmitter: "deleteEmitter"
      },
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"]],
      decls: 3,
      vars: 0,
      consts: [[1, "row", "no-gutters"], [1, "col-12"], ["libTemplateDirective", ""]],
      template: function ItemTemplateHolderComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, ItemTemplateHolderComponent_ng_template_2_Template, 0, 0, "ng-template", 2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
      },
      directives: [_directives_template_directive__WEBPACK_IMPORTED_MODULE_1__["TemplateDirective"]],
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJwcm9qZWN0cy9uZy1ldmVudHN0b3JlLWxpc3Rpbmcvc3JjL2xpYi9jb21wb25lbnRzL2l0ZW0tdGVtcGxhdGUtaG9sZGVyL2l0ZW0tdGVtcGxhdGUtaG9sZGVyLmNvbXBvbmVudC5jc3MifQ== */"],
      changeDetection: 0
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ItemTemplateHolderComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'lib-item-template-holder',
          templateUrl: './item-template-holder.component.html',
          styleUrls: ['./item-template-holder.component.css'],
          changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }]
      }], function () {
        return [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]
        }];
      }, {
        itemComponentClass: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        data: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        lookups: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        updateEmitter: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        updateLookupsEmitter: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        showModalEmitter: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        deleteEmitter: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        itemHost: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
          args: [_directives_template_directive__WEBPACK_IMPORTED_MODULE_1__["TemplateDirective"]]
        }]
      });
    })();
    /***/

  },

  /***/
  "../ng-eventstore-listing/src/lib/components/ng-header-footer-template-holder/ng-header-footer-template-holder.component.ts":
  /*!**********************************************************************************************************************************!*\
    !*** ../ng-eventstore-listing/src/lib/components/ng-header-footer-template-holder/ng-header-footer-template-holder.component.ts ***!
    \**********************************************************************************************************************************/

  /*! exports provided: NgHeaderFooterTemplateHolderComponent */

  /***/
  function ngEventstoreListingSrcLibComponentsNgHeaderFooterTemplateHolderNgHeaderFooterTemplateHolderComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "NgHeaderFooterTemplateHolderComponent", function () {
      return NgHeaderFooterTemplateHolderComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _directives_template_directive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ../../directives/template.directive */
    "../ng-eventstore-listing/src/lib/directives/template.directive.ts");

    function NgHeaderFooterTemplateHolderComponent_ng_template_2_Template(rf, ctx) {}

    var NgHeaderFooterTemplateHolderComponent = /*#__PURE__*/function () {
      function NgHeaderFooterTemplateHolderComponent(componentFactoryResolver) {
        _classCallCheck(this, NgHeaderFooterTemplateHolderComponent);

        this.componentFactoryResolver = componentFactoryResolver;
        this.headerData = {};
        this.maxSize = 5;
        this.actionEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.pageChangedEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.filterEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
      }

      _createClass(NgHeaderFooterTemplateHolderComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {// this.loadComponent();
        }
      }, {
        key: "ngAfterViewInit",
        value: function ngAfterViewInit() {
          this.loadComponent();
        }
      }, {
        key: "ngOnChanges",
        value: function ngOnChanges(changes) {
          var self = this;

          if (self.componentRef) {
            var changesKeys = Object.keys(changes);
            changesKeys.forEach(function (key) {
              self.componentRef.instance[key] = changes[key].currentValue;
            });
            self.componentRef.instance.updatePageValues();
          }
        }
      }, {
        key: "loadComponent",
        value: function loadComponent() {
          var componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.componentClass);
          var viewContainerRef = this.itemHost.viewContainerRef;
          viewContainerRef.clear();
          this.componentRef = viewContainerRef.createComponent(componentFactory);
          this.componentRef.instance.data = this.headerData;
          this.componentRef.instance.pageIndex = this.pageIndex;
          this.componentRef.instance.itemsPerPage = this.itemsPerPage;
          this.componentRef.instance.totalItemCount = this.totalItemCount;
          this.componentRef.instance.actualItemCount = this.actualItemCount;
          this.componentRef.instance.maxSize = this.maxSize;
          this.componentRef.instance.actionEmitter = this.actionEmitter;
          this.componentRef.instance.pageChangedEmitter = this.pageChangedEmitter;
          this.componentRef.instance.filterEmitter = this.filterEmitter;
          this.componentRef.instance.ngOnInit();
          this.componentRef.instance.updatePageValues();
        }
      }]);

      return NgHeaderFooterTemplateHolderComponent;
    }();

    NgHeaderFooterTemplateHolderComponent.ɵfac = function NgHeaderFooterTemplateHolderComponent_Factory(t) {
      return new (t || NgHeaderFooterTemplateHolderComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]));
    };

    NgHeaderFooterTemplateHolderComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: NgHeaderFooterTemplateHolderComponent,
      selectors: [["lib-ng-header-footer-template-holder"]],
      viewQuery: function NgHeaderFooterTemplateHolderComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_directives_template_directive__WEBPACK_IMPORTED_MODULE_1__["TemplateDirective"], true);
        }

        if (rf & 2) {
          var _t;

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.itemHost = _t.first);
        }
      },
      inputs: {
        componentClass: "componentClass",
        headerData: "headerData",
        pageIndex: "pageIndex",
        itemsPerPage: "itemsPerPage",
        actualItemCount: "actualItemCount",
        totalItemCount: "totalItemCount",
        maxSize: "maxSize"
      },
      outputs: {
        actionEmitter: "actionEmitter",
        pageChangedEmitter: "pageChangedEmitter",
        filterEmitter: "filterEmitter"
      },
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"]],
      decls: 3,
      vars: 0,
      consts: [[1, "row"], [1, "col-12"], ["libTemplateDirective", ""]],
      template: function NgHeaderFooterTemplateHolderComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, NgHeaderFooterTemplateHolderComponent_ng_template_2_Template, 0, 0, "ng-template", 2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
      },
      directives: [_directives_template_directive__WEBPACK_IMPORTED_MODULE_1__["TemplateDirective"]],
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJwcm9qZWN0cy9uZy1ldmVudHN0b3JlLWxpc3Rpbmcvc3JjL2xpYi9jb21wb25lbnRzL25nLWhlYWRlci1mb290ZXItdGVtcGxhdGUtaG9sZGVyL25nLWhlYWRlci1mb290ZXItdGVtcGxhdGUtaG9sZGVyLmNvbXBvbmVudC5jc3MifQ== */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](NgHeaderFooterTemplateHolderComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'lib-ng-header-footer-template-holder',
          templateUrl: './ng-header-footer-template-holder.component.html',
          styleUrls: ['./ng-header-footer-template-holder.component.css']
        }]
      }], function () {
        return [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]
        }];
      }, {
        componentClass: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        headerData: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        pageIndex: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        itemsPerPage: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        actualItemCount: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        totalItemCount: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        maxSize: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        actionEmitter: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        pageChangedEmitter: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        filterEmitter: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        itemHost: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
          args: [_directives_template_directive__WEBPACK_IMPORTED_MODULE_1__["TemplateDirective"]]
        }]
      });
    })();
    /***/

  },

  /***/
  "../ng-eventstore-listing/src/lib/components/template-components/header-footer-template/header-footer-template.component.ts":
  /*!**********************************************************************************************************************************!*\
    !*** ../ng-eventstore-listing/src/lib/components/template-components/header-footer-template/header-footer-template.component.ts ***!
    \**********************************************************************************************************************************/

  /*! exports provided: HeaderFooterTemplateComponent */

  /***/
  function ngEventstoreListingSrcLibComponentsTemplateComponentsHeaderFooterTemplateHeaderFooterTemplateComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "HeaderFooterTemplateComponent", function () {
      return HeaderFooterTemplateComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");

    var HeaderFooterTemplateComponent = /*#__PURE__*/function () {
      function HeaderFooterTemplateComponent(changeDetectorRef) {
        var _this = this;

        _classCallCheck(this, HeaderFooterTemplateComponent);

        this.changeDetectorRef = changeDetectorRef; // Event Emitters

        this.actionEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.pageChangedEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.filterEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();

        this.onPageChanged = function (event) {
          _this.pageIndex = event;

          _this.updatePageValues();

          _this.pageChangedEmitter.emit(event);
        };

        this.onFilter = function (event) {
          _this.filterEmitter.emit(event);
        };

        this.onAction = function (action, data) {
          var actionData = {
            action: action,
            data: data
          };

          _this.actionEmitter.emit(actionData);
        };
      }

      _createClass(HeaderFooterTemplateComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {}
      }, {
        key: "updatePageValues",
        value: function updatePageValues() {
          this.pageStart = (this.pageIndex - 1) * this.itemsPerPage + 1;
          this.pageEnd = Math.min((this.pageIndex - 1) * this.itemsPerPage + this.actualItemCount, this.totalItemCount);
          this.changeDetectorRef.detectChanges();
        }
      }]);

      return HeaderFooterTemplateComponent;
    }();

    HeaderFooterTemplateComponent.ɵfac = function HeaderFooterTemplateComponent_Factory(t) {
      return new (t || HeaderFooterTemplateComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]));
    };

    HeaderFooterTemplateComponent.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
      type: HeaderFooterTemplateComponent
    });
    /***/
  },

  /***/
  "../ng-eventstore-listing/src/lib/components/template-components/index.ts":
  /*!********************************************************************************!*\
    !*** ../ng-eventstore-listing/src/lib/components/template-components/index.ts ***!
    \********************************************************************************/

  /*! exports provided: ItemTemplateComponent, HeaderFooterTemplateComponent */

  /***/
  function ngEventstoreListingSrcLibComponentsTemplateComponentsIndexTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony import */


    var _item_template_item_template_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! ./item-template/item-template.component */
    "../ng-eventstore-listing/src/lib/components/template-components/item-template/item-template.component.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "ItemTemplateComponent", function () {
      return _item_template_item_template_component__WEBPACK_IMPORTED_MODULE_0__["ItemTemplateComponent"];
    });
    /* harmony import */


    var _header_footer_template_header_footer_template_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./header-footer-template/header-footer-template.component */
    "../ng-eventstore-listing/src/lib/components/template-components/header-footer-template/header-footer-template.component.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "HeaderFooterTemplateComponent", function () {
      return _header_footer_template_header_footer_template_component__WEBPACK_IMPORTED_MODULE_1__["HeaderFooterTemplateComponent"];
    });
    /***/

  },

  /***/
  "../ng-eventstore-listing/src/lib/components/template-components/item-template/item-template.component.ts":
  /*!****************************************************************************************************************!*\
    !*** ../ng-eventstore-listing/src/lib/components/template-components/item-template/item-template.component.ts ***!
    \****************************************************************************************************************/

  /*! exports provided: ItemTemplateComponent */

  /***/
  function ngEventstoreListingSrcLibComponentsTemplateComponentsItemTemplateItemTemplateComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ItemTemplateComponent", function () {
      return ItemTemplateComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");

    var ItemTemplateComponent = /*#__PURE__*/function () {
      function ItemTemplateComponent(changeDetectorRef) {
        var _this2 = this;

        _classCallCheck(this, ItemTemplateComponent);

        this.changeDetectorRef = changeDetectorRef; // Event Emitters

        this.onUpdateEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.onUpdateLookupsEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.onShowModalEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.onDeleteEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();

        this.registerChangeFunction = function (changeFn) {
          _this2._changeFn = changeFn;
        };

        this.onUpdate = function (propertyName, actionData) {
          var actionEventEmitterData = {
            propertyName: propertyName,
            id: _this2.data.get(_this2.idPropertyName),
            data: actionData
          };

          _this2.onUpdateEmitter.emit(actionEventEmitterData);
        };

        this.onUpdateLookups = function (lookup) {
          var actionEventEmitterData = {
            lookup: lookup
          };

          _this2.onUpdateLookupsEmitter.emit(actionEventEmitterData);
        };

        this.onShowModal = function (modalName, data) {
          var actionEventEmitterData = {
            modalName: modalName,
            id: _this2.data.get(_this2.idPropertyName),
            data: data
          };

          _this2.onShowModalEmitter.emit(actionEventEmitterData);
        };

        this.onDelete = function (actionData) {
          var actionEventEmitterData = {
            id: _this2.data.get(_this2.idPropertyName),
            data: actionData
          };

          _this2.onDeleteEmitter.emit(actionEventEmitterData);
        };
      }

      _createClass(ItemTemplateComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {}
      }, {
        key: "ngOnChanges",
        value: function ngOnChanges(changes) {
          if (this._changeFn) {
            this._changeFn(changes);
          }

          if (this.changeDetectorRef) {
            this.changeDetectorRef.detectChanges();
          }
        }
      }]);

      return ItemTemplateComponent;
    }();

    ItemTemplateComponent.ɵfac = function ItemTemplateComponent_Factory(t) {
      return new (t || ItemTemplateComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]));
    };

    ItemTemplateComponent.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
      type: ItemTemplateComponent,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"]]
    });
    /***/
  },

  /***/
  "../ng-eventstore-listing/src/lib/directives/template.directive.ts":
  /*!*************************************************************************!*\
    !*** ../ng-eventstore-listing/src/lib/directives/template.directive.ts ***!
    \*************************************************************************/

  /*! exports provided: TemplateDirective */

  /***/
  function ngEventstoreListingSrcLibDirectivesTemplateDirectiveTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "TemplateDirective", function () {
      return TemplateDirective;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");

    var TemplateDirective = function TemplateDirective(viewContainerRef) {
      _classCallCheck(this, TemplateDirective);

      this.viewContainerRef = viewContainerRef;
    };

    TemplateDirective.ɵfac = function TemplateDirective_Factory(t) {
      return new (t || TemplateDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"]));
    };

    TemplateDirective.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
      type: TemplateDirective,
      selectors: [["", "libTemplateDirective", ""]]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TemplateDirective, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"],
        args: [{
          selector: '[libTemplateDirective]'
        }]
      }], function () {
        return [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "../ng-eventstore-listing/src/lib/enums/filter-types.ts":
  /*!**************************************************************!*\
    !*** ../ng-eventstore-listing/src/lib/enums/filter-types.ts ***!
    \**************************************************************/

  /*! exports provided: FilterOperator */

  /***/
  function ngEventstoreListingSrcLibEnumsFilterTypesTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "FilterOperator", function () {
      return FilterOperator;
    });

    var FilterOperator;

    (function (FilterOperator) {
      FilterOperator["range"] = "range";
      FilterOperator["is"] = "is";
    })(FilterOperator || (FilterOperator = {}));
    /***/

  },

  /***/
  "../ng-eventstore-listing/src/lib/enums/sort-direction.ts":
  /*!****************************************************************!*\
    !*** ../ng-eventstore-listing/src/lib/enums/sort-direction.ts ***!
    \****************************************************************/

  /*! exports provided: SortDirection */

  /***/
  function ngEventstoreListingSrcLibEnumsSortDirectionTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "SortDirection", function () {
      return SortDirection;
    });

    var SortDirection;

    (function (SortDirection) {
      SortDirection["ASC"] = "ASC";
      SortDirection["DESC"] = "DESC";
    })(SortDirection || (SortDirection = {}));
    /***/

  },

  /***/
  "../ng-eventstore-listing/src/lib/ng-eventstore-listing.component.ts":
  /*!***************************************************************************!*\
    !*** ../ng-eventstore-listing/src/lib/ng-eventstore-listing.component.ts ***!
    \***************************************************************************/

  /*! exports provided: NgEventstoreListingComponent */

  /***/
  function ngEventstoreListingSrcLibNgEventstoreListingComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "NgEventstoreListingComponent", function () {
      return NgEventstoreListingComponent;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "../../node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! rxjs/operators */
    "../../node_modules/rxjs/_esm2015/operators/index.js");
    /* harmony import */


    var immutable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! immutable */
    "../../node_modules/immutable/dist/immutable.es.js");
    /* harmony import */


    var lodash_es_clone__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! lodash-es/clone */
    "../../node_modules/lodash-es/clone.js");
    /* harmony import */


    var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! rxjs */
    "../../node_modules/rxjs/_esm2015/index.js");
    /* harmony import */


    var _services_script_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./services/script.service */
    "../ng-eventstore-listing/src/lib/services/script.service.ts");
    /* harmony import */


    var _services_playback_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ./services/playback.service */
    "../ng-eventstore-listing/src/lib/services/playback.service.ts");
    /* harmony import */


    var _services_playback_list_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ./services/playback-list.service */
    "../ng-eventstore-listing/src/lib/services/playback-list.service.ts");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! @angular/common */
    "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _components_item_template_holder_item_template_holder_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
    /*! ./components/item-template-holder/item-template-holder.component */
    "../ng-eventstore-listing/src/lib/components/item-template-holder/item-template-holder.component.ts");

    function NgEventstoreListingComponent_div_0_Template(rf, ctx) {
      if (rf & 1) {
        var _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 1);

        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 2);

        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "lib-item-template-holder", 3);

        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("updateEmitter", function NgEventstoreListingComponent_div_0_Template_lib_item_template_holder_updateEmitter_2_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r3);

          var ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();

          return ctx_r2.onUpdate($event);
        })("updateLookupsEmitter", function NgEventstoreListingComponent_div_0_Template_lib_item_template_holder_updateLookupsEmitter_2_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r3);

          var ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();

          return ctx_r4.onUpdateLookups($event);
        })("showModalEmitter", function NgEventstoreListingComponent_div_0_Template_lib_item_template_holder_showModalEmitter_2_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r3);

          var ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();

          return ctx_r5.onShowModal($event);
        })("deleteEmitter", function NgEventstoreListingComponent_div_0_Template_lib_item_template_holder_deleteEmitter_2_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r3);

          var ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();

          return ctx_r6.onDelete($event);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var item_r1 = ctx.$implicit;

        var ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("data", item_r1)("itemComponentClass", ctx_r0.itemComponentClass)("lookups", ctx_r0.lookups);
      }
    }

    var NgEventstoreListingComponent = /*#__PURE__*/function () {
      function NgEventstoreListingComponent(changeDetectorRef, scriptService, playbackService, playbackListService) {
        var _this3 = this;

        _classCallCheck(this, NgEventstoreListingComponent);

        this.changeDetectorRef = changeDetectorRef;
        this.scriptService = scriptService;
        this.playbackService = playbackService;
        this.playbackListService = playbackListService;
        this.updateEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.updateLookupsEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.showModalEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.deleteEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.playbackListLoadedEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.lookups = {};
        this.filters = null;
        this.sort = null;
        this.pageIndex = 1;
        this.initialized = false;
        this.getPlaybackListSubject = new rxjs__WEBPACK_IMPORTED_MODULE_5__["Subject"]();
        this.subscriptionTokens = [];
        this.playbackList = {
          get: function get(rowId, callback) {
            var rowIndex = _this3.dataList.findIndex(function (value) {
              return value.get('rowId') === rowId;
            });

            if (rowIndex > -1) {
              callback(null, _this3.dataList.get(rowIndex));
            } else {
              callback(new Error("Row with rowId: ".concat(rowIndex, " does not exist")), null);
            }
          },
          add: function add(rowId, revision, data, meta, callback) {
            var newEntry = {
              rowId: rowId,
              revision: revision,
              data: data,
              meta: meta
            };

            _this3.changeDetectorRef.markForCheck();

            _this3.dataList = _this3.dataList.push(immutable__WEBPACK_IMPORTED_MODULE_3__["fromJS"](newEntry));
            callback();
          },
          update: function update(rowId, revision, oldData, newData, meta, callback) {
            var rowIndex = _this3.dataList.findIndex(function (value) {
              return value.get('rowId') === rowId;
            });

            var newEntry = immutable__WEBPACK_IMPORTED_MODULE_3__["fromJS"]({
              rowId: rowId,
              revision: revision,
              data: Object.assign(Object.assign({}, oldData), newData),
              meta: meta
            });

            if (rowIndex > -1) {
              _this3.dataList = _this3.dataList.set(rowIndex, newEntry);
              callback();
            } else {
              callback(new Error("Row with rowId: ".concat(rowIndex, " does not exist")));
            }
          },
          "delete": function _delete(rowId, callback) {
            var rowIndex = _this3.dataList.findIndex(function (value) {
              return value.get('rowId') === rowId;
            });

            if (rowIndex > -1) {
              _this3.dataList = _this3.dataList.remove(rowIndex);
              callback(null);
            } else {
              callback(new Error("Row with rowId: ".concat(rowIndex, " does not exist")));
            }
          }
        };
        this.stateFunctions = {
          getState: function getState(id) {
            var index = _this3.dataList.findIndex(function (row) {
              return row.get('rowId') === id;
            });

            return _this3.dataList.get(index).toJS();
          },
          setState: function setState(id, data) {
            var index = _this3.dataList.findIndex(function (row) {
              return row.get('rowId') === id;
            });

            _this3.dataList = _this3.dataList.set(index, immutable__WEBPACK_IMPORTED_MODULE_3__["fromJS"](data));

            _this3.changeDetectorRef.markForCheck();
          }
        };
      }

      _createClass(NgEventstoreListingComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {}
      }, {
        key: "ngOnChanges",
        value: function ngOnChanges(changes) {
          var _this4 = this;

          var self = this;

          if (!this.initialized) {
            this._initializeRequests();

            this._loadScripts();

            this.initialized = true;
          }

          var changesKeys = Object.keys(changes);
          changesKeys.forEach(function (key) {
            self[key] = changes[key].currentValue;

            switch (key) {
              case 'pageIndex':
              case 'filters':
              case 'sort':
                {
                  _this4.requestPlaybackList();

                  break;
                }
            }
          });
        }
      }, {
        key: "ngOnDestroy",
        value: function ngOnDestroy() {
          this._resetSubscriptions();
        }
      }, {
        key: "trackByFn",
        value: function trackByFn(index, item) {
          return item.get('rowId');
        }
      }, {
        key: "_initializeRequests",
        value: function _initializeRequests() {
          var _this5 = this;

          this.getPlaybackListSubscription = this.getPlaybackListSubject.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["debounceTime"])(100), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])(function (params) {
            return _this5.playbackListService.getPlaybackList(_this5.playbackListBaseUrl, params.playbackListName, params.startIndex, params.limit, params.filters, params.sort);
          })).subscribe(function (res) {
            _this5.dataList = immutable__WEBPACK_IMPORTED_MODULE_3__["fromJS"](res.rows);
            _this5.dataCount = res.rows.length;
            _this5.dataTotalCount = res.count;

            _this5._resetSubscriptions();

            _this5._initSubscriptions();

            _this5.changeDetectorRef.markForCheck();

            _this5.playbackListLoadedEmitter.emit({
              totalItems: _this5.dataTotalCount,
              dataCount: _this5.dataCount
            });
          });
        }
      }, {
        key: "getPlaybackList",
        value: function getPlaybackList(playbackListName, startIndex, limit, filters, sort) {
          var playbackListRequestParams = {
            playbackListName: playbackListName,
            startIndex: startIndex,
            limit: limit,
            filters: filters,
            sort: sort
          };
          this.getPlaybackListSubject.next(playbackListRequestParams);
        }
      }, {
        key: "requestPlaybackList",
        value: function requestPlaybackList() {
          var startIndex = this.itemsPerPage * (this.pageIndex - 1);
          this.getPlaybackList(this.playbackListName, startIndex, this.itemsPerPage, this.filters, this.sort);
        }
      }, {
        key: "_loadScripts",
        value: function _loadScripts() {
          if (this.scriptStore) {
            this.scriptService.init(this.scriptStore);
          }
        }
      }, {
        key: "_initSubscriptions",
        value: function _initSubscriptions() {
          return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var _this6 = this;

            var self;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    self = this; // Per row subscriptions

                    self.dataList.forEach(function (row) {
                      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(_this6, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                        var query;
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                query = Object(lodash_es_clone__WEBPACK_IMPORTED_MODULE_4__["default"])(self.itemSubscriptionConfiguration.query);
                                query.aggregateId = query.aggregateId.replace(/{{rowId}}/g, row.get('rowId'));
                                _context.t0 = this.subscriptionTokens;
                                _context.next = 5;
                                return self.playbackService.registerForPlayback(self.itemSubscriptionConfiguration.playbackScriptName, self, query, self.stateFunctions, row.get('revision') + 1, self.playbackList);

                              case 5:
                                _context.t1 = _context.sent;

                                _context.t0.push.call(_context.t0, _context.t1);

                              case 7:
                              case "end":
                                return _context.stop();
                            }
                          }
                        }, _callee, this);
                      }));
                    }); // List subscription

                    _context2.t0 = this.subscriptionTokens;
                    _context2.next = 5;
                    return self.playbackService.registerForPlayback(self.listSubscriptionConfiguration.playbackScriptName, self, self.listSubscriptionConfiguration.query, self.stateFunctions, // TODO: Revision response from getPlaybackList
                    0, self.playbackList);

                  case 5:
                    _context2.t1 = _context2.sent;

                    _context2.t0.push.call(_context2.t0, _context2.t1);

                  case 7:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));
        }
      }, {
        key: "_resetSubscriptions",
        value: function _resetSubscriptions() {
          var _this7 = this;

          this.subscriptionTokens.forEach(function (subscriptionToken) {
            _this7.playbackService.unRegisterForPlayback(subscriptionToken);
          });
          this.subscriptionTokens = [];
        }
      }, {
        key: "onUpdate",
        value: function onUpdate(payload) {
          this.updateEmitter.emit(payload);
        }
      }, {
        key: "onUpdateLookups",
        value: function onUpdateLookups(payload) {
          this.updateLookupsEmitter.emit(payload);
        }
      }, {
        key: "onShowModal",
        value: function onShowModal(payload) {
          this.showModalEmitter.emit(payload);
        }
      }, {
        key: "onDelete",
        value: function onDelete(payload) {
          this.deleteEmitter.emit(payload);
        }
      }]);

      return NgEventstoreListingComponent;
    }();

    NgEventstoreListingComponent.ɵfac = function NgEventstoreListingComponent_Factory(t) {
      return new (t || NgEventstoreListingComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_script_service__WEBPACK_IMPORTED_MODULE_6__["ScriptService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_playback_service__WEBPACK_IMPORTED_MODULE_7__["PlaybackService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_playback_list_service__WEBPACK_IMPORTED_MODULE_8__["PlaybackListService"]));
    };

    NgEventstoreListingComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: NgEventstoreListingComponent,
      selectors: [["lib-ng-eventstore-listing"]],
      inputs: {
        itemComponentClass: "itemComponentClass",
        lookups: "lookups",
        socketUrl: "socketUrl",
        playbackListBaseUrl: "playbackListBaseUrl",
        scriptStore: "scriptStore",
        itemSubscriptionConfiguration: "itemSubscriptionConfiguration",
        listSubscriptionConfiguration: "listSubscriptionConfiguration",
        playbackListName: "playbackListName",
        filters: "filters",
        sort: "sort",
        pageIndex: "pageIndex",
        itemsPerPage: "itemsPerPage"
      },
      outputs: {
        updateEmitter: "updateEmitter",
        updateLookupsEmitter: "updateLookupsEmitter",
        showModalEmitter: "showModalEmitter",
        deleteEmitter: "deleteEmitter",
        playbackListLoadedEmitter: "playbackListLoadedEmitter"
      },
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵNgOnChangesFeature"]],
      decls: 1,
      vars: 2,
      consts: [["class", "row", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "row"], [1, "col-12"], [3, "data", "itemComponentClass", "lookups", "updateEmitter", "updateLookupsEmitter", "showModalEmitter", "deleteEmitter"]],
      template: function NgEventstoreListingComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](0, NgEventstoreListingComponent_div_0_Template, 3, 3, "div", 0);
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.dataList)("ngForTrackBy", ctx.trackByFn);
        }
      },
      directives: [_angular_common__WEBPACK_IMPORTED_MODULE_9__["NgForOf"], _components_item_template_holder_item_template_holder_component__WEBPACK_IMPORTED_MODULE_10__["ItemTemplateHolderComponent"]],
      encapsulation: 2,
      changeDetection: 0
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](NgEventstoreListingComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
          selector: 'lib-ng-eventstore-listing',
          templateUrl: './ng-eventstore-listing.component.html',
          styles: [],
          changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectionStrategy"].OnPush
        }]
      }], function () {
        return [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]
        }, {
          type: _services_script_service__WEBPACK_IMPORTED_MODULE_6__["ScriptService"]
        }, {
          type: _services_playback_service__WEBPACK_IMPORTED_MODULE_7__["PlaybackService"]
        }, {
          type: _services_playback_list_service__WEBPACK_IMPORTED_MODULE_8__["PlaybackListService"]
        }];
      }, {
        updateEmitter: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"]
        }],
        updateLookupsEmitter: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"]
        }],
        showModalEmitter: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"]
        }],
        deleteEmitter: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"]
        }],
        playbackListLoadedEmitter: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"]
        }],
        itemComponentClass: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"]
        }],
        lookups: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"]
        }],
        socketUrl: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"]
        }],
        playbackListBaseUrl: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"]
        }],
        scriptStore: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"]
        }],
        itemSubscriptionConfiguration: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"]
        }],
        listSubscriptionConfiguration: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"]
        }],
        playbackListName: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"]
        }],
        filters: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"]
        }],
        sort: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"]
        }],
        pageIndex: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"]
        }],
        itemsPerPage: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"]
        }]
      });
    })();
    /***/

  },

  /***/
  "../ng-eventstore-listing/src/lib/ng-eventstore-listing.module.ts":
  /*!************************************************************************!*\
    !*** ../ng-eventstore-listing/src/lib/ng-eventstore-listing.module.ts ***!
    \************************************************************************/

  /*! exports provided: NgEventstoreListingModule */

  /***/
  function ngEventstoreListingSrcLibNgEventstoreListingModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "NgEventstoreListingModule", function () {
      return NgEventstoreListingModule;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _ng_eventstore_listing_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./ng-eventstore-listing.component */
    "../ng-eventstore-listing/src/lib/ng-eventstore-listing.component.ts");
    /* harmony import */


    var _components_item_template_holder_item_template_holder_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./components/item-template-holder/item-template-holder.component */
    "../ng-eventstore-listing/src/lib/components/item-template-holder/item-template-holder.component.ts");
    /* harmony import */


    var _components_ng_header_footer_template_holder_ng_header_footer_template_holder_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./components/ng-header-footer-template-holder/ng-header-footer-template-holder.component */
    "../ng-eventstore-listing/src/lib/components/ng-header-footer-template-holder/ng-header-footer-template-holder.component.ts");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/common */
    "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _directives_template_directive__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./directives/template.directive */
    "../ng-eventstore-listing/src/lib/directives/template.directive.ts");
    /* harmony import */


    var _services_socket_io_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./services/socket.io.service */
    "../ng-eventstore-listing/src/lib/services/socket.io.service.ts");
    /* harmony import */


    var socket_io_client__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! socket.io-client */
    "../../node_modules/socket.io-client/lib/index.js");
    /* harmony import */


    var socket_io_client__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(socket_io_client__WEBPACK_IMPORTED_MODULE_7__);

    var NgEventstoreListingModule = function NgEventstoreListingModule() {
      _classCallCheck(this, NgEventstoreListingModule);
    };

    NgEventstoreListingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: NgEventstoreListingModule
    });
    NgEventstoreListingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      factory: function NgEventstoreListingModule_Factory(t) {
        return new (t || NgEventstoreListingModule)();
      },
      providers: [{
        provide: _services_socket_io_service__WEBPACK_IMPORTED_MODULE_6__["IO_TOKEN"],
        useValue: socket_io_client__WEBPACK_IMPORTED_MODULE_7__
      }],
      imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"]]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](NgEventstoreListingModule, {
        declarations: [_ng_eventstore_listing_component__WEBPACK_IMPORTED_MODULE_1__["NgEventstoreListingComponent"], _components_item_template_holder_item_template_holder_component__WEBPACK_IMPORTED_MODULE_2__["ItemTemplateHolderComponent"], _components_ng_header_footer_template_holder_ng_header_footer_template_holder_component__WEBPACK_IMPORTED_MODULE_3__["NgHeaderFooterTemplateHolderComponent"], _directives_template_directive__WEBPACK_IMPORTED_MODULE_5__["TemplateDirective"]],
        imports: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"]],
        exports: [_ng_eventstore_listing_component__WEBPACK_IMPORTED_MODULE_1__["NgEventstoreListingComponent"], _components_ng_header_footer_template_holder_ng_header_footer_template_holder_component__WEBPACK_IMPORTED_MODULE_3__["NgHeaderFooterTemplateHolderComponent"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](NgEventstoreListingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
          declarations: [_ng_eventstore_listing_component__WEBPACK_IMPORTED_MODULE_1__["NgEventstoreListingComponent"], _components_item_template_holder_item_template_holder_component__WEBPACK_IMPORTED_MODULE_2__["ItemTemplateHolderComponent"], _components_ng_header_footer_template_holder_ng_header_footer_template_holder_component__WEBPACK_IMPORTED_MODULE_3__["NgHeaderFooterTemplateHolderComponent"], _directives_template_directive__WEBPACK_IMPORTED_MODULE_5__["TemplateDirective"]],
          imports: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"]],
          exports: [_ng_eventstore_listing_component__WEBPACK_IMPORTED_MODULE_1__["NgEventstoreListingComponent"], _components_ng_header_footer_template_holder_ng_header_footer_template_holder_component__WEBPACK_IMPORTED_MODULE_3__["NgHeaderFooterTemplateHolderComponent"]],
          providers: [{
            provide: _services_socket_io_service__WEBPACK_IMPORTED_MODULE_6__["IO_TOKEN"],
            useValue: socket_io_client__WEBPACK_IMPORTED_MODULE_7__
          }]
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "../ng-eventstore-listing/src/lib/services/playback-list.service.ts":
  /*!**************************************************************************!*\
    !*** ../ng-eventstore-listing/src/lib/services/playback-list.service.ts ***!
    \**************************************************************************/

  /*! exports provided: PlaybackListService */

  /***/
  function ngEventstoreListingSrcLibServicesPlaybackListServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PlaybackListService", function () {
      return PlaybackListService;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/common/http */
    "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");

    var PlaybackListService = /*#__PURE__*/function () {
      function PlaybackListService(http) {
        _classCallCheck(this, PlaybackListService);

        this.http = http;
      }

      _createClass(PlaybackListService, [{
        key: "getPlaybackList",
        value: function getPlaybackList(playbackListBaseUrl, playbackListName, startIndex, limit, filters, sort) {
          var url = "".concat(playbackListBaseUrl, "/playback-list/").concat(playbackListName, "?startIndex=").concat(startIndex, "&limit=").concat(limit);

          if (filters) {
            url += "&filters=".concat(JSON.stringify(filters));
          }

          if (sort) {
            console.log(sort);
            url += "&sort=".concat(JSON.stringify(sort));
          }

          return this.http.get(url);
        }
      }]);

      return PlaybackListService;
    }();

    PlaybackListService.ɵfac = function PlaybackListService_Factory(t) {
      return new (t || PlaybackListService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]));
    };

    PlaybackListService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: PlaybackListService,
      factory: PlaybackListService.ɵfac,
      providedIn: 'root'
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PlaybackListService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
          providedIn: 'root'
        }]
      }], function () {
        return [{
          type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "../ng-eventstore-listing/src/lib/services/playback.service.ts":
  /*!*********************************************************************!*\
    !*** ../ng-eventstore-listing/src/lib/services/playback.service.ts ***!
    \*********************************************************************/

  /*! exports provided: PlaybackService */

  /***/
  function ngEventstoreListingSrcLibServicesPlaybackServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PlaybackService", function () {
      return PlaybackService;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "../../node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _script_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./script.service */
    "../ng-eventstore-listing/src/lib/services/script.service.ts");
    /* harmony import */


    var _push_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./push.service */
    "../ng-eventstore-listing/src/lib/services/push.service.ts");

    var PlaybackService = /*#__PURE__*/function () {
      function PlaybackService(scriptService, pushService) {
        _classCallCheck(this, PlaybackService);

        this.scriptService = scriptService;
        this.pushService = pushService;
        this.playbackRegistry = {};
      }

      _createClass(PlaybackService, [{
        key: "unRegisterForPlayback",
        value: function unRegisterForPlayback(token) {
          return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return this.pushService.unsubscribe(token);

                  case 2:
                    // unregister from playback registry
                    delete this.playbackRegistry[token];

                  case 3:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this);
          }));
        }
      }, {
        key: "registerForPlayback",
        value: function registerForPlayback(scriptName, owner, query, stateFunctions, offset, playbackList) {
          return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var script, playbackScript, subscriptionId;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return this.scriptService.load(scriptName);

                  case 2:
                    script = _context4.sent;
                    playbackScript = window[script[0].meta.objectName];
                    _context4.next = 6;
                    return this.pushService.subscribe(query, offset, this, function (err, eventObj, owner2, token) {
                      // owner is playbackservice
                      var self = owner2;
                      var registration = self.playbackRegistry[token]; // call the function
                      // const playbackList = self.createPlaybacklist(registration)
                      // if (typeof eventObj.stateType !== 'undefined' && eventObj.eventSource)
                      //   eventObj = eventObj.eventSource;

                      if (eventObj.context === 'states') {//
                      } else {
                        var playbackFunction = registration.playbackScript.playbackInterface[eventObj.payload.name];

                        if (playbackFunction) {
                          var row = stateFunctions.getState(eventObj.aggregateId);
                          var state = row.data;
                          var funcs = {
                            emit: function emit(targetQuery, payload, done) {
                              done();
                            },
                            getPlaybackList: function getPlaybackList(playbackListName, callback) {
                              if (registration.playbackList) {
                                callback(null, registration.playbackList);
                              } else {
                                callback(new Error('PlaybackList does not exist in this registration'), null);
                              }
                            }
                          };

                          var doneCallback = function doneCallback() {
                            stateFunctions.setState(row.rowId, row);
                          };

                          playbackFunction(state, eventObj, funcs, doneCallback);
                        }
                      }
                    });

                  case 6:
                    subscriptionId = _context4.sent;
                    // just use the subscriptionId to map the push subscription to the playback
                    this.playbackRegistry[subscriptionId] = {
                      playbackScript: playbackScript,
                      owner: owner,
                      registrationId: subscriptionId,
                      playbackList: playbackList
                    };
                    console.log('subscribed to playback: ', subscriptionId, query);
                    return _context4.abrupt("return", subscriptionId);

                  case 10:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4, this);
          }));
        }
      }]);

      return PlaybackService;
    }();

    PlaybackService.ɵfac = function PlaybackService_Factory(t) {
      return new (t || PlaybackService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_script_service__WEBPACK_IMPORTED_MODULE_2__["ScriptService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_push_service__WEBPACK_IMPORTED_MODULE_3__["PushService"]));
    };

    PlaybackService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: PlaybackService,
      factory: PlaybackService.ɵfac,
      providedIn: 'root'
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](PlaybackService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"],
        args: [{
          providedIn: 'root'
        }]
      }], function () {
        return [{
          type: _script_service__WEBPACK_IMPORTED_MODULE_2__["ScriptService"]
        }, {
          type: _push_service__WEBPACK_IMPORTED_MODULE_3__["PushService"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "../ng-eventstore-listing/src/lib/services/push.service.ts":
  /*!*****************************************************************!*\
    !*** ../ng-eventstore-listing/src/lib/services/push.service.ts ***!
    \*****************************************************************/

  /*! exports provided: PushService */

  /***/
  function ngEventstoreListingSrcLibServicesPushServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PushService", function () {
      return PushService;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "../../node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _socket_io_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./socket.io.service */
    "../ng-eventstore-listing/src/lib/services/socket.io.service.ts");
    /* harmony import */


    var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../../environments/environment */
    "../ng-eventstore-listing/src/environments/environment.ts"); // TODO: Make environment pluggable or derivable


    var PushService = /*#__PURE__*/function () {
      function PushService(io) {
        _classCallCheck(this, PushService);

        this.io = io;
        this.subscriptions = {};
        this.ioPush = this.io("".concat(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].pushHost, "/events"));
        var self = this;
        this.ioPush.on('message', function (eventObj, token) {
          console.log('got message from push server: ', eventObj, token);
          var clientTokens = Object.keys(self.subscriptions); // redirect to mapped subscription/token callback

          clientTokens.forEach(function (clientToken) {
            var sub = self.subscriptions[clientToken];

            if (sub.token === token) {
              // update next offset (from stream revision) for this subscription, so for reconnecting
              if (!isNaN(eventObj.streamRevision)) {
                sub.offset = eventObj.streamRevision + 1;
              }

              if (typeof sub.cb === 'function') {
                sub.cb(undefined, eventObj, sub.owner, clientToken);
              } // iterate on monitors meta tags


              var tags = Object.keys(sub.monitorTags);
              tags.forEach(function (tag) {
                // check for state/eventSource._meta or event._meta
                if (eventObj._meta && eventObj._meta.tag === tag) {
                  var reason = 'N/A';

                  if (typeof eventObj.eventType === 'string') {
                    reason = eventObj.eventType;
                  } else if (typeof eventObj.stateType === 'string') {
                    reason = eventObj.stateType;

                    if (eventObj.eventSource && typeof eventObj.eventSource.eventType === 'string') {
                      reason += " <- ".concat(eventObj.eventSource.eventType);
                    }
                  } // iterate on the monitors


                  var monitors = sub.monitorTags[tag];
                  monitors.forEach(function (monitor) {
                    monitor.callback(reason, eventObj._meta);
                  });
                }
              });
            }
          });
        });
      }

      _createClass(PushService, [{
        key: "subscribe",
        value: function subscribe(query, offset, owner, cb) {
          return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
            var clientToken;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    clientToken = Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(); // map new subscription, then try to subscribe to server asap

                    this.subscriptions[clientToken] = {
                      query: query,
                      offset: offset,
                      owner: owner,
                      cb: cb,
                      monitorTags: {}
                    };
                    this.subscribeStreams();
                    return _context5.abrupt("return", clientToken);

                  case 4:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5, this);
          }));
        }
      }, {
        key: "subscribeStreams",
        value: function subscribeStreams() {
          var _this8 = this;

          if (this.ioPush.connected) {
            var clientTokens = Object.keys(this.subscriptions);
            clientTokens.forEach(function (clientToken) {
              var sub = _this8.subscriptions[clientToken]; // do server subsribe for those without tokens yet

              if (!sub.token) {
                // build up proper subscribe request query
                var query = Object.assign(sub.query, {
                  offset: sub.offset
                });

                _this8.ioPush.emit('subscribe', query, function (token) {
                  if (token) {
                    console.log('Server Subscribed:', token, query);
                    sub.token = token;
                  } else {
                    console.error('Subscribe error for query', query);
                  }
                });
              }
            });
          }
        }
      }, {
        key: "unsubscribe",
        value: function unsubscribe(clientToken) {
          var _this9 = this;

          return new Promise(function (resolve, reject) {
            try {
              // just do a force server unsubscribe and removal of subscription entry
              var sub = _this9.subscriptions[clientToken];

              if (sub) {
                if (sub.token && _this9.ioPush.connected) {
                  //  NOTE: need to handle unsubscribe/emit errors
                  _this9.ioPush.emit('unsubscribe', sub.token, function (ack) {
                    if (ack.error) {
                      console.error(ack.error);
                      reject(ack.error);
                    } else {
                      resolve();
                    }
                  });
                }

                delete _this9.subscriptions[clientToken];
                resolve(); // console.log('Unsubscribed:', clientToken, subscriptions);
              } // no subscription


              resolve();
            } catch (error) {
              reject(error);
              console.error('error in unsubscribing: ', error);
            }
          });
        }
      }]);

      return PushService;
    }();

    PushService.ɵfac = function PushService_Factory(t) {
      return new (t || PushService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_socket_io_service__WEBPACK_IMPORTED_MODULE_2__["IO_TOKEN"]));
    };

    PushService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: PushService,
      factory: PushService.ɵfac,
      providedIn: 'root'
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](PushService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"],
        args: [{
          providedIn: 'root'
        }]
      }], function () {
        return [{
          type: undefined,
          decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
            args: [_socket_io_service__WEBPACK_IMPORTED_MODULE_2__["IO_TOKEN"]]
          }]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "../ng-eventstore-listing/src/lib/services/script.service.ts":
  /*!*******************************************************************!*\
    !*** ../ng-eventstore-listing/src/lib/services/script.service.ts ***!
    \*******************************************************************/

  /*! exports provided: ScriptService */

  /***/
  function ngEventstoreListingSrcLibServicesScriptServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ScriptService", function () {
      return ScriptService;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");

    var ScriptService = /*#__PURE__*/function () {
      function ScriptService() {
        _classCallCheck(this, ScriptService);

        this.scripts = {};
      }

      _createClass(ScriptService, [{
        key: "init",
        value: function init(scriptStore) {
          var _this10 = this;

          scriptStore.forEach(function (script) {
            _this10.scripts[script.name] = {
              loaded: false,
              src: script.src,
              meta: script.meta
            };
          });
        }
      }, {
        key: "load",
        value: function load() {
          var _this11 = this;

          var promises = [];

          for (var _len = arguments.length, scripts = new Array(_len), _key = 0; _key < _len; _key++) {
            scripts[_key] = arguments[_key];
          }

          scripts.forEach(function (script) {
            return promises.push(_this11.loadScript(script));
          });
          return Promise.all(promises);
        }
      }, {
        key: "loadScript",
        value: function loadScript(name) {
          var _this12 = this;

          return new Promise(function (resolve, reject) {
            // resolve if already loaded
            if (_this12.scripts[name].loaded) {
              resolve({
                script: name,
                loaded: true,
                status: 'Already Loaded',
                meta: _this12.scripts[name].meta
              });
            } else {
              // load script
              var script = document.createElement('script');
              script.type = 'text/javascript';
              script.src = _this12.scripts[name].src;

              if (script.readyState) {
                // IE
                script.onreadystatechange = function () {
                  if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    _this12.scripts[name].loaded = true;
                    resolve({
                      script: name,
                      loaded: true,
                      status: 'Loaded',
                      meta: _this12.scripts[name].meta
                    });
                  }
                };
              } else {
                // Others
                script.onload = function () {
                  _this12.scripts[name].loaded = true;
                  resolve({
                    script: name,
                    loaded: true,
                    status: 'Loaded',
                    meta: _this12.scripts[name].meta
                  });
                };
              }

              script.onerror = function (error) {
                return resolve({
                  script: name,
                  loaded: false,
                  status: 'Loaded',
                  meta: _this12.scripts[name].meta
                });
              };

              document.getElementsByTagName('head')[0].appendChild(script);
            }
          });
        }
      }]);

      return ScriptService;
    }();

    ScriptService.ɵfac = function ScriptService_Factory(t) {
      return new (t || ScriptService)();
    };

    ScriptService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: ScriptService,
      factory: ScriptService.ɵfac,
      providedIn: 'root'
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ScriptService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
          providedIn: 'root'
        }]
      }], function () {
        return [];
      }, null);
    })();
    /***/

  },

  /***/
  "../ng-eventstore-listing/src/lib/services/socket.io.service.ts":
  /*!**********************************************************************!*\
    !*** ../ng-eventstore-listing/src/lib/services/socket.io.service.ts ***!
    \**********************************************************************/

  /*! exports provided: IO_TOKEN */

  /***/
  function ngEventstoreListingSrcLibServicesSocketIoServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "IO_TOKEN", function () {
      return IO_TOKEN;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");

    var IO_TOKEN = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["InjectionToken"]('io');
    /***/
  },

  /***/
  "./$$_lazy_route_resource lazy recursive":
  /*!******************************************************!*\
    !*** ./$$_lazy_route_resource lazy namespace object ***!
    \******************************************************/

  /*! no static exports found */

  /***/
  function $$_lazy_route_resourceLazyRecursive(module, exports) {
    function webpackEmptyAsyncContext(req) {
      // Here Promise.resolve().then() is used instead of new Promise() to prevent
      // uncaught exception popping up in devtools
      return Promise.resolve().then(function () {
        var e = new Error("Cannot find module '" + req + "'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
      });
    }

    webpackEmptyAsyncContext.keys = function () {
      return [];
    };

    webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
    module.exports = webpackEmptyAsyncContext;
    webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";
    /***/
  },

  /***/
  "./src/app/app-routing.module.ts":
  /*!***************************************!*\
    !*** ./src/app/app-routing.module.ts ***!
    \***************************************/

  /*! exports provided: AppRoutingModule */

  /***/
  function srcAppAppRoutingModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function () {
      return AppRoutingModule;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/router */
    "../../node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");

    var routes = [];

    var AppRoutingModule = function AppRoutingModule() {
      _classCallCheck(this, AppRoutingModule);
    };

    AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: AppRoutingModule
    });
    AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      factory: function AppRoutingModule_Factory(t) {
        return new (t || AppRoutingModule)();
      },
      imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppRoutingModule, {
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
          imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
          exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/app.component.ts":
  /*!**********************************!*\
    !*** ./src/app/app.component.ts ***!
    \**********************************/

  /*! exports provided: AppComponent */

  /***/
  function srcAppAppComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppComponent", function () {
      return AppComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _test_row_test_row_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./test-row/test-row.component */
    "./src/app/test-row/test-row.component.ts");
    /* harmony import */


    var _script_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./script.store */
    "./src/app/script.store.ts");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/forms */
    "../../node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
    /* harmony import */


    var projects_ng_eventstore_listing_src_lib_enums_filter_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! projects/ng-eventstore-listing/src/lib/enums/filter-types */
    "../ng-eventstore-listing/src/lib/enums/filter-types.ts");
    /* harmony import */


    var projects_ng_eventstore_listing_src_lib_enums_sort_direction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! projects/ng-eventstore-listing/src/lib/enums/sort-direction */
    "../ng-eventstore-listing/src/lib/enums/sort-direction.ts");
    /* harmony import */


    var _environments_environment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ../environments/environment */
    "./src/environments/environment.ts");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! @angular/common */
    "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ngx-bootstrap/pagination */
    "../../node_modules/ngx-bootstrap/__ivy_ngcc__/pagination/fesm2015/ngx-bootstrap-pagination.js");
    /* harmony import */


    var _ng_eventstore_listing_src_lib_ng_eventstore_listing_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! ../../../ng-eventstore-listing/src/lib/ng-eventstore-listing.component */
    "../ng-eventstore-listing/src/lib/ng-eventstore-listing.component.ts");

    function AppComponent_option_17_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "option", 11);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var sortOption_r1 = ctx.$implicit;

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngValue", sortOption_r1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](sortOption_r1.label);
      }
    }

    var AppComponent = /*#__PURE__*/function () {
      function AppComponent() {
        _classCallCheck(this, AppComponent);

        this.rowComponentClass = _test_row_test_row_component__WEBPACK_IMPORTED_MODULE_1__["TestRowComponent"];
        this.dealershipFilterFormControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"]();
        this.sortFormControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](); // FOR DEMO

        this.itemsPerPage = 3; // = 25;

        this.pageIndex = 1;
        this.totalItems = 0;
        this.socketUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].socketUrl;
        this.scriptStore = _script_store__WEBPACK_IMPORTED_MODULE_2__["ScriptStore"];
        this.playbackListName = 'auction_titles_list_view';
        this.itemSubscriptionConfiguration = {
          query: {
            context: 'auction',
            aggregate: 'auction-titles-dashboard-vehicle',
            aggregateId: "{{rowId}}"
          },
          playbackScriptName: 'auction-titles-dashboard-vehicle'
        };
        this.listSubscriptionConfiguration = {
          query: {
            context: 'states',
            aggregate: 'titles-dashboard-list-projection',
            aggregateId: 'titles-dashboard-list-projection-result'
          },
          playbackScriptName: 'auction-titles-dashboard-vehicle-list'
        };
        this.sortOptions = [{
          field: 'soldAt',
          sortDirection: projects_ng_eventstore_listing_src_lib_enums_sort_direction__WEBPACK_IMPORTED_MODULE_5__["SortDirection"].ASC,
          label: 'Sold Date (Newest First)'
        }, {
          field: 'soldAt',
          sortDirection: projects_ng_eventstore_listing_src_lib_enums_sort_direction__WEBPACK_IMPORTED_MODULE_5__["SortDirection"].DESC,
          label: 'Sold Date (Oldest First)'
        }];
      }

      _createClass(AppComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          var _this13 = this;

          this.dealershipFilterFormControl.valueChanges.subscribe(function (value) {
            if (value) {
              var newFilter = {
                operator: projects_ng_eventstore_listing_src_lib_enums_filter_types__WEBPACK_IMPORTED_MODULE_4__["FilterOperator"].is,
                field: 'dealershipId',
                value: value
              };
              _this13.filters = [newFilter];
            }
          });
          this.sortFormControl.valueChanges.subscribe(function (value) {
            var sort = {
              field: value.field,
              sortDirection: value.sortDirection
            };
            _this13.sort = sort;
          });
        }
      }, {
        key: "onPageChanged",
        value: function onPageChanged(pageEvent) {
          this.pageIndex = pageEvent.page;
        }
      }, {
        key: "playbackListLoaded",
        value: function playbackListLoaded(data) {
          this.totalItems = data.totalItems;
        }
      }]);

      return AppComponent;
    }();

    AppComponent.ɵfac = function AppComponent_Factory(t) {
      return new (t || AppComponent)();
    };

    AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: AppComponent,
      selectors: [["app-root"]],
      decls: 21,
      vars: 17,
      consts: [[1, "container-fluid", "pt-4"], ["for", "dealership-filter"], ["id", "dealership-filter", 3, "formControl"], ["value", "dealership-1"], ["value", "dealership-2"], ["value", "dealership-3"], ["for", "sort"], ["id", "sort", 3, "formControl"], [3, "ngValue", 4, "ngFor", "ngForOf"], [3, "totalItems", "itemsPerPage", "pageChanged"], [3, "itemComponentClass", "itemSubscriptionConfiguration", "listSubscriptionConfiguration", "socketUrl", "scriptStore", "playbackListName", "pageIndex", "itemsPerPage", "filters", "sort", "playbackListLoadedEmitter"], [3, "ngValue"]],
      template: function AppComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h3");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "NG Eventstore Listing Demo");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h5");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, " Filters ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "label", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Seller Dealership: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "select", 2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "option", 3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Glendale Toyota");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "option", 4);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Honda of Vacaville");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "option", 5);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Airport Marina Ford");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "label", 6);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Sort By: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "select", 7);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](17, AppComponent_option_17_Template, 2, 2, "option", 8);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "pagination", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("pageChanged", function AppComponent_Template_pagination_pageChanged_18_listener($event) {
            return ctx.onPageChanged($event);
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "lib-ng-eventstore-listing", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("playbackListLoadedEmitter", function AppComponent_Template_lib_ng_eventstore_listing_playbackListLoadedEmitter_19_listener($event) {
            return ctx.playbackListLoaded($event);
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "pagination", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("pageChanged", function AppComponent_Template_pagination_pageChanged_20_listener($event) {
            return ctx.onPageChanged($event);
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControl", ctx.dealershipFilterFormControl);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControl", ctx.sortFormControl);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.sortOptions);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("totalItems", ctx.totalItems)("itemsPerPage", ctx.itemsPerPage);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("itemComponentClass", ctx.rowComponentClass)("itemSubscriptionConfiguration", ctx.itemSubscriptionConfiguration)("listSubscriptionConfiguration", ctx.listSubscriptionConfiguration)("socketUrl", ctx.socketUrl)("scriptStore", ctx.scriptStore)("playbackListName", ctx.playbackListName)("pageIndex", ctx.pageIndex)("itemsPerPage", ctx.itemsPerPage)("filters", ctx.filters)("sort", ctx.sort);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("totalItems", ctx.totalItems)("itemsPerPage", ctx.itemsPerPage);
        }
      },
      directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["SelectControlValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControlDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["NgSelectOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵangular_packages_forms_forms_x"], _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgForOf"], ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_8__["PaginationComponent"], _ng_eventstore_listing_src_lib_ng_eventstore_listing_component__WEBPACK_IMPORTED_MODULE_9__["NgEventstoreListingComponent"]],
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJwcm9qZWN0cy9uZy1ldmVudHN0b3JlLWxpc3Rpbmctc2hvd2Nhc2Uvc3JjL2FwcC9hcHAuY29tcG9uZW50LmNzcyJ9 */"],
      changeDetection: 0
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-root',
          templateUrl: './app.component.html',
          styleUrls: ['./app.component.css'],
          changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }]
      }], function () {
        return [];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/app/app.module.ts":
  /*!*******************************!*\
    !*** ./src/app/app.module.ts ***!
    \*******************************/

  /*! exports provided: AppModule */

  /***/
  function srcAppAppModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppModule", function () {
      return AppModule;
    });
    /* harmony import */


    var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/platform-browser */
    "../../node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/forms */
    "../../node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/common/http */
    "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
    /* harmony import */


    var _app_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./app-routing.module */
    "./src/app/app-routing.module.ts");
    /* harmony import */


    var _app_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./app.component */
    "./src/app/app.component.ts");
    /* harmony import */


    var _ng_eventstore_listing_src_lib_ng_eventstore_listing_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ../../../ng-eventstore-listing/src/lib/ng-eventstore-listing.module */
    "../ng-eventstore-listing/src/lib/ng-eventstore-listing.module.ts");
    /* harmony import */


    var _test_row_test_row_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ./test-row/test-row.component */
    "./src/app/test-row/test-row.component.ts");
    /* harmony import */


    var _test_footer_test_footer_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ./test-footer/test-footer.component */
    "./src/app/test-footer/test-footer.component.ts");
    /* harmony import */


    var ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! ngx-bootstrap/pagination */
    "../../node_modules/ngx-bootstrap/__ivy_ngcc__/pagination/fesm2015/ngx-bootstrap-pagination.js");

    var AppModule = function AppModule() {
      _classCallCheck(this, AppModule);
    };

    AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({
      type: AppModule,
      bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]]
    });
    AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({
      factory: function AppModule_Factory(t) {
        return new (t || AppModule)();
      },
      providers: [],
      imports: [[_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"], _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"], _ng_eventstore_listing_src_lib_ng_eventstore_listing_module__WEBPACK_IMPORTED_MODULE_6__["NgEventstoreListingModule"], ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_9__["PaginationModule"].forRoot()]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppModule, {
        declarations: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"], _test_row_test_row_component__WEBPACK_IMPORTED_MODULE_7__["TestRowComponent"], _test_footer_test_footer_component__WEBPACK_IMPORTED_MODULE_8__["TestFooterComponent"]],
        imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"], _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"], _ng_eventstore_listing_src_lib_ng_eventstore_listing_module__WEBPACK_IMPORTED_MODULE_6__["NgEventstoreListingModule"], ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_9__["PaginationModule"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](AppModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
          declarations: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"], _test_row_test_row_component__WEBPACK_IMPORTED_MODULE_7__["TestRowComponent"], _test_footer_test_footer_component__WEBPACK_IMPORTED_MODULE_8__["TestFooterComponent"]],
          imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"], _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"], _ng_eventstore_listing_src_lib_ng_eventstore_listing_module__WEBPACK_IMPORTED_MODULE_6__["NgEventstoreListingModule"], ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_9__["PaginationModule"].forRoot()],
          providers: [],
          bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]]
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/script.store.ts":
  /*!*********************************!*\
    !*** ./src/app/script.store.ts ***!
    \*********************************/

  /*! exports provided: ScriptStore */

  /***/
  function srcAppScriptStoreTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ScriptStore", function () {
      return ScriptStore;
    });
    /* harmony import */


    var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! ../environments/environment */
    "./src/environments/environment.ts"); // TODO: Can be simplified


    var ScriptStore = [{
      name: 'auction-sales-channel-instance-vehicle-list',
      meta: {
        objectName: 'auction-sales-channel-instance-vehicle-list'
      },
      src: "".concat(_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].scriptUrl, "/auction-sales-channel-instance-vehicle-list.projection.js")
    }, {
      name: 'auction-titles-dashboard-vehicle-list',
      meta: {
        objectName: 'auction-titles-dashboard-vehicle-list'
      },
      src: "".concat(_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].scriptUrl, "/auction-titles-dashboard-list.projection.js")
    }, {
      name: 'auction-vehicle-list',
      meta: {
        objectName: 'auction-vehicle-list'
      },
      src: "".concat(_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].scriptUrl, "//auction-vehicle-list.projection.js")
    }, {
      name: 'auction-titles-dashboard-vehicle',
      meta: {
        objectName: 'auction-titles-dashboard-vehicle'
      },
      src: "".concat(_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].scriptUrl, "//auction-titles-dashboard-vehicle.projection.js")
    }];
    /***/
  },

  /***/
  "./src/app/test-footer/test-footer.component.ts":
  /*!******************************************************!*\
    !*** ./src/app/test-footer/test-footer.component.ts ***!
    \******************************************************/

  /*! exports provided: TestFooterComponent */

  /***/
  function srcAppTestFooterTestFooterComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "TestFooterComponent", function () {
      return TestFooterComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _ng_eventstore_listing_src_lib_components_template_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ../../../../ng-eventstore-listing/src/lib/components/template-components */
    "../ng-eventstore-listing/src/lib/components/template-components/index.ts");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common */
    "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");

    function TestFooterComponent_div_1_span_4_Template(rf, ctx) {
      if (rf & 1) {
        var _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "|");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function TestFooterComponent_div_1_span_4_Template_a_click_2_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4);

          var page_r2 = ctx.$implicit;

          var ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

          return ctx_r3.onPage(page_r2);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var page_r2 = ctx.$implicit;

        var ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", page_r2, " ");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](page_r2 - 0 === ctx_r1.pagesArray.length ? "|" : "");
      }
    }

    function TestFooterComponent_div_1_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "label", 3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, TestFooterComponent_div_1_span_4_Template, 5, 2, "span", 4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate3"]("", ctx_r0.pageStart, "-", ctx_r0.pageEnd, " of ", ctx_r0.totalItemCount, "");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r0.pagesArray);
      }
    }

    var TestFooterComponent = /*#__PURE__*/function (_ng_eventstore_listin) {
      _inherits(TestFooterComponent, _ng_eventstore_listin);

      var _super = _createSuper(TestFooterComponent);

      function TestFooterComponent(changeDetectorRef) {
        var _this14;

        _classCallCheck(this, TestFooterComponent);

        _this14 = _super.call(this, changeDetectorRef);
        _this14.pagesArray = [];
        _this14.cdr = changeDetectorRef;
        return _this14;
      }

      _createClass(TestFooterComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          this.pagesArray = [];
          this.numberOfPages = Math.ceil(this.totalItemCount / this.itemsPerPage);

          for (var i = 0; i < this.numberOfPages; i++) {
            this.pagesArray.push(i + 1);
          }

          this.cdr.detectChanges();
        }
      }, {
        key: "onPage",
        value: function onPage(page) {
          this.onPageChanged(page);
        }
      }]);

      return TestFooterComponent;
    }(_ng_eventstore_listing_src_lib_components_template_components__WEBPACK_IMPORTED_MODULE_1__["HeaderFooterTemplateComponent"]);

    TestFooterComponent.ɵfac = function TestFooterComponent_Factory(t) {
      return new (t || TestFooterComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]));
    };

    TestFooterComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: TestFooterComponent,
      selectors: [["app-test"]],
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]],
      decls: 2,
      vars: 1,
      consts: [[1, "row", "mt-3"], ["class", "pager-container col-4 offset-8 text-right", 4, "ngIf"], [1, "pager-container", "col-4", "offset-8", "text-right"], [1, "text-sm", "d-lg-inline-block", "pr-2"], [4, "ngFor", "ngForOf"], ["href", "#", 3, "click"]],
      template: function TestFooterComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, TestFooterComponent_div_1_Template, 5, 4, "div", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.totalItemCount);
        }
      },
      directives: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgForOf"]],
      styles: ["div.row-item[_ngcontent-%COMP%] {\n  border: solid black 1px;\n  min-height: 100px;\n  margin-bottom: 20px;\n}\n\ndiv.border-right[_ngcontent-%COMP%] {\n  border-right: solid gray 1px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2plY3RzL25nLWV2ZW50c3RvcmUtbGlzdGluZy1zaG93Y2FzZS9zcmMvYXBwL3Rlc3QtZm9vdGVyL3Rlc3QtZm9vdGVyLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSx1QkFBdUI7RUFDdkIsaUJBQWlCO0VBQ2pCLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLDRCQUE0QjtBQUM5QiIsImZpbGUiOiJwcm9qZWN0cy9uZy1ldmVudHN0b3JlLWxpc3Rpbmctc2hvd2Nhc2Uvc3JjL2FwcC90ZXN0LWZvb3Rlci90ZXN0LWZvb3Rlci5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiZGl2LnJvdy1pdGVtIHtcbiAgYm9yZGVyOiBzb2xpZCBibGFjayAxcHg7XG4gIG1pbi1oZWlnaHQ6IDEwMHB4O1xuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xufVxuXG5kaXYuYm9yZGVyLXJpZ2h0IHtcbiAgYm9yZGVyLXJpZ2h0OiBzb2xpZCBncmF5IDFweDtcbn1cbiJdfQ== */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TestFooterComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-test',
          templateUrl: './test-footer.component.html',
          styleUrls: ['./test-footer.component.css']
        }]
      }], function () {
        return [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/app/test-row/test-row.component.ts":
  /*!************************************************!*\
    !*** ./src/app/test-row/test-row.component.ts ***!
    \************************************************/

  /*! exports provided: TestRowComponent */

  /***/
  function srcAppTestRowTestRowComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "TestRowComponent", function () {
      return TestRowComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var projects_ng_eventstore_listing_src_lib_components_template_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! projects/ng-eventstore-listing/src/lib/components/template-components */
    "../ng-eventstore-listing/src/lib/components/template-components/index.ts");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common */
    "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");

    var TestRowComponent = /*#__PURE__*/function (_projects_ng_eventsto) {
      _inherits(TestRowComponent, _projects_ng_eventsto);

      var _super2 = _createSuper(TestRowComponent);

      function TestRowComponent(changeDetectorRef) {
        _classCallCheck(this, TestRowComponent);

        return _super2.call(this, changeDetectorRef);
      }

      _createClass(TestRowComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          // Bind onChanges
          this.registerChangeFunction(this.onChanges);
        }
      }, {
        key: "onChanges",
        value: function onChanges(changes) {}
      }]);

      return TestRowComponent;
    }(projects_ng_eventstore_listing_src_lib_components_template_components__WEBPACK_IMPORTED_MODULE_1__["ItemTemplateComponent"]);

    TestRowComponent.ɵfac = function TestRowComponent_Factory(t) {
      return new (t || TestRowComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]));
    };

    TestRowComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: TestRowComponent,
      selectors: [["app-test"]],
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]],
      decls: 188,
      vars: 28,
      consts: [[1, "row", "row-item"], [1, "col-3", "border-right"], [1, "row", "no-gutters", "mb-3", "mt-1"], [1, "col-7", "text-md"], [1, "font-weight-bold"], [1, "col-4", "text-md"], [1, "col-1", "text-md"], [1, "row", "no-gutters"], [1, "col-12"], [1, "row", "mb-2"], [1, "col-6"], [1, "col-6", "text-md"], [1, "text-right"], [1, "row", "mb-4"], [1, "col-12", "bottom-align"], [1, "btn", "btn-default", "btn-block"], [1, "col-3", "pt-1", "border-right"], [1, "row", "mb-5", "pb-3"], ["type", "checkbox", 1, "checkbox"], [1, "row"], [1, "row", "mb-2", "pb-1", "no-gutters"], [1, "col-2", "pr-1"], [1, "btn", "btn-default", "btn-block", "btn-sm"], [1, "col-5", "px-1"], [1, "col-5"], [1, "row", "mb-5", "pb-2"], [1, "col-3", "pt-1"], [1, "font-weight-bold", "text-md"], [1, "font-weight-bold", "text-md", "text-right"], [1, "font-weight-bold", "text-right"], [1, "row", "mb-3"], [1, "row", "mb-2", "no-gutters"], [1, "col-6", "pr-1"], [1, "col-6", "pl-1"]],
      template: function TestRowComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "span", 4);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "br");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "span", 4);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 5);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "label", 4);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](12, "number");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "div", 6);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 7);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 8);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Seller: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](20, "div", 11);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Dealership: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 11);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 12);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "Mailing Address: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "div", 12);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, "Seller Rep: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](39, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "div", 13);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, "DMV Clerk: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](44, "div", 11);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "div", 14);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "button", 15);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, "Folow-up Notes");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "div", 16);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](53, "Title Status: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "div", 11);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "div", 12);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](56);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](60, "Received Date: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](61, "div", 11);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](65, "Tracking Number: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](66, "div", 11);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](67, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](68, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](69, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](70, "Title Clerk: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](71, "div", 11);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](72, "div", 17);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](73, "div", 8);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](74, "input", 18);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](75, "label");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](76, "\xA0\xA0 Title Received ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](77, "div", 19);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](78, "div", 14);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](79, "div", 20);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](80, "div", 21);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](81, "button", 22);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](82, "^");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](83, "div", 23);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](84, "button", 22);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](85, "View Title");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](86, "div", 24);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](87, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](88, "03-02-2020");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](89, " TR ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](90, "div", 19);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](91, "div", 8);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](92, "button", 15);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](93, "Recap Notes");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](94, "div", 16);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](95, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](96, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](97, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](98, " Buyer: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](99, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](100, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](101, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](102, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](103, " Dealership: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](104, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](105, "div", 12);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](106);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](107, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](108, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](109, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](110, " Mailing Address: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](111, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](112, "div", 12);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](113);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](114, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](115, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](116, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](117, " Buyer Rep: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](118, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](119, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](120, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](121, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](122, " Title to Buyer: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](123, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](124, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](125, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](126, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](127, " Tracking Number: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](128, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](129, "div", 25);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](130, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](131, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](132, " Collection Issue: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](133, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](134, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](135, "div", 14);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](136, "button", 15);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](137, "Seller Responses");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](138, "div", 26);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](139, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](140, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](141, "span", 27);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](142, "SOLD");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](143, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](144, "div", 28);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](145);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](146, "currency");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](147, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](148, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](149, "span", 4);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](150, "Current Amount: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](151, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](152, "div", 29);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](153);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](154, "currency");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](155, "div", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](156, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](157, "span", 4);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](158, "Sold Date: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](159, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](160, "div", 29);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](161);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](162, "date");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](163, "div", 30);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](164, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](165, "span", 4);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](166, "Payment Method: ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](167, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](168, "div", 12);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](169);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](170, "div", 19);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](171, "div", 8);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](172, "input", 18);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](173, "label");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](174, "\xA0\xA0 Pending Arbitration ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](175, "div", 19);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](176, "div", 14);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](177, "div", 31);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](178, "div", 32);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](179, "button", 15);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](180, "Buyer Invoice");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](181, "div", 7);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](182, "div", 32);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](183, "button", 15);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](184, "Adjust Price");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](185, "div", 33);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](186, "button", 15);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](187, "History");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.get("data").get("yearName") + " " + ctx.data.get("data").get("makeName") + " " + ctx.data.get("data").get("modelName"));

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.get("data").get("vin"));

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](12, 12, ctx.data.get("data").get("mileage"), "0.0-0"), "mi");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](16);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.get("data").get("dealershipName"));

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.get("data").get("dealershipAddress"));

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](22);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.get("data").get("titleStatus"));

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](50);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.get("data").get("soldDealershipName"));

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.get("data").get("soldDealershipAddress"));

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](32);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind4"](146, 15, ctx.data.get("data").get("soldAmount"), "USD", "symbol", "0.0-0"));

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](8);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind4"](154, 20, ctx.data.get("data").get("soldAmount"), "USD", "symbol", "0.0-0"));

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](8);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](162, 25, ctx.data.get("data").get("soldAt"), "MMMM d, y"));

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](8);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.get("data").get("paymentMethod"));
        }
      },
      pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["DecimalPipe"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["CurrencyPipe"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["DatePipe"]],
      styles: ["div.row-item[_ngcontent-%COMP%] {\n  border: solid gray 1px;\n  min-height: 200px;\n  margin-bottom: 20px;\n  min-width: 1200px;\n}\n\ndiv.border-right[_ngcontent-%COMP%] {\n  border-right: solid gray 1px;\n}\n\n.text-md[_ngcontent-%COMP%] {\n  font-size: 14px !important;\n}\n\nbutton.btn.btn-default[_ngcontent-%COMP%] {\n  color: #333;\n  background-color: #fff;\n  border-color: #ccc;\n  font-weight: 500 !important;\n}\n\ndiv.bottom-align[_ngcontent-%COMP%] {\n  position: absolute !important;\n  bottom: 10px !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2plY3RzL25nLWV2ZW50c3RvcmUtbGlzdGluZy1zaG93Y2FzZS9zcmMvYXBwL3Rlc3Qtcm93L3Rlc3Qtcm93LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxzQkFBc0I7RUFDdEIsaUJBQWlCO0VBQ2pCLG1CQUFtQjtFQUNuQixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSw0QkFBNEI7QUFDOUI7O0FBRUE7RUFDRSwwQkFBMEI7QUFDNUI7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsc0JBQXNCO0VBQ3RCLGtCQUFrQjtFQUNsQiwyQkFBMkI7QUFDN0I7O0FBRUE7RUFDRSw2QkFBNkI7RUFDN0IsdUJBQXVCO0FBQ3pCIiwiZmlsZSI6InByb2plY3RzL25nLWV2ZW50c3RvcmUtbGlzdGluZy1zaG93Y2FzZS9zcmMvYXBwL3Rlc3Qtcm93L3Rlc3Qtcm93LmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJkaXYucm93LWl0ZW0ge1xuICBib3JkZXI6IHNvbGlkIGdyYXkgMXB4O1xuICBtaW4taGVpZ2h0OiAyMDBweDtcbiAgbWFyZ2luLWJvdHRvbTogMjBweDtcbiAgbWluLXdpZHRoOiAxMjAwcHg7XG59XG5cbmRpdi5ib3JkZXItcmlnaHQge1xuICBib3JkZXItcmlnaHQ6IHNvbGlkIGdyYXkgMXB4O1xufVxuXG4udGV4dC1tZCB7XG4gIGZvbnQtc2l6ZTogMTRweCAhaW1wb3J0YW50O1xufVxuXG5idXR0b24uYnRuLmJ0bi1kZWZhdWx0IHtcbiAgY29sb3I6ICMzMzM7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gIGJvcmRlci1jb2xvcjogI2NjYztcbiAgZm9udC13ZWlnaHQ6IDUwMCAhaW1wb3J0YW50O1xufVxuXG5kaXYuYm90dG9tLWFsaWduIHtcbiAgcG9zaXRpb246IGFic29sdXRlICFpbXBvcnRhbnQ7XG4gIGJvdHRvbTogMTBweCAhaW1wb3J0YW50O1xufSJdfQ== */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TestRowComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-test',
          templateUrl: './test-row.component.html',
          styleUrls: ['./test-row.component.css']
        }]
      }], function () {
        return [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/environments/environment.ts":
  /*!*****************************************!*\
    !*** ./src/environments/environment.ts ***!
    \*****************************************/

  /*! exports provided: environment */

  /***/
  function srcEnvironmentsEnvironmentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "environment", function () {
      return environment;
    }); // This file can be replaced during build by using the `fileReplacements` array.
    // `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
    // The list of file replacements can be found in `angular.json`.


    var environment = {
      production: false,
      socketUrl: 'http://localhost:3000/events',
      playbackListUrl: 'http://localhost:3000/',
      scriptUrl: 'http://localhost:3000/'
    };
    /*
     * For easier debugging in development mode, you can import the following file
     * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
     *
     * This import should be commented out in production mode because it will have a negative impact
     * on performance if an error is thrown.
     */
    // import 'zone.js/dist/zone-error';  // Included with Angular CLI.

    /***/
  },

  /***/
  "./src/main.ts":
  /*!*********************!*\
    !*** ./src/main.ts ***!
    \*********************/

  /*! no exports provided */

  /***/
  function srcMainTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./environments/environment */
    "./src/environments/environment.ts");
    /* harmony import */


    var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./app/app.module */
    "./src/app/app.module.ts");
    /* harmony import */


    var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/platform-browser */
    "../../node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");

    if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
      Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
    }

    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])["catch"](function (err) {
      return console.error(err);
    });
    /***/

  },

  /***/
  0:
  /*!***************************!*\
    !*** multi ./src/main.ts ***!
    \***************************/

  /*! no static exports found */

  /***/
  function _(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(
    /*! /home/travis/build/saperiumrocks/ng-eventstore-listing/projects/ng-eventstore-listing-showcase/src/main.ts */
    "./src/main.ts");
    /***/
  },

  /***/
  1:
  /*!********************!*\
    !*** ws (ignored) ***!
    \********************/

  /*! no static exports found */

  /***/
  function _(module, exports) {
    /* (ignored) */

    /***/
  }
}, [[0, "runtime", "vendor"]]]);
//# sourceMappingURL=main-es5.js.map