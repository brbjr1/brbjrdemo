import {LightningElement, track, api} from 'lwc';

export default class LwcAccountComponent extends LightningElement {

@track recordId;

  @track showSpinner = true;
  @track error;
  hasInitialized = false;

  @api myUserOption;

  @api name;

  renderedCallback() {
    if (this.hasInitialized) {
      return;
    }
    this.hasInitialized = true;
	this.showSpinner = false;

    
  }


}