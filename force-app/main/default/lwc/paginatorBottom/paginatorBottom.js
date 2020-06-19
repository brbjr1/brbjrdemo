import { LightningElement, api, track } from "lwc";
export default class PaginatorBottom extends LightningElement {
  @track _totalrecords;
  @api get totalrecords() {
    return _totalrecords;
  }
  set totalrecords(value) {
    this._totalrecords = value;
    this.setupbuttons();
  }

  @track _currentpage;
  @api get currentpage() {
    return _currentpage;
  }
  set currentpage(value) {
    this._currentpage = value;
    this.setupbuttons();
  }

  @track _pagesize;
  @api get pagesize() {
    return _pagesize;
  }
  set pagesize(value) {
    this._pagesize = value;
    this.setupbuttons();
  }

  @track firstButtonDisabled;
  @track lastButtonDisabled;

  // Following are the private properties to a class.
  lastpage = false;
  firstpage = false;

  setupbuttons() {
    this.firstButtonDisabled = !this._currentpage || this._currentpage === 1;
    this.lastButtonDisabled =
      !this._totalrecords ||
      this._totalrecords === 0 ||
      Math.ceil(this._totalrecords / this._pagesize) === this._currentpage;
  }

  //Fire events based on the button actions
  handlePrevious() {
    this.dispatchEvent(new CustomEvent("previous"));
  }
  handleNext() {
    this.dispatchEvent(new CustomEvent("next"));
  }
  handleFirst() {
    this.dispatchEvent(new CustomEvent("first"));
  }
  handleLast() {
    this.dispatchEvent(new CustomEvent("last"));
  }
}