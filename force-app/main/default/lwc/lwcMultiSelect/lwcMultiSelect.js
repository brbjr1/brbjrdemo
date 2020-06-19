import { LightningElement, api, track } from 'lwc';

export default class LwcMultiSelect extends LightningElement {

  @api width = 100;
  @api variant = '';
  @api label = '';
  @api dropdownLength = 5;


  @api clearselected()
  {
	 this.options_.forEach(function(option) {
		if (option.selected === true) {
			option.selected = false;
		}
	});
	
	this.selectedPills = this.getPillArray();
    this.despatchChangeEvent();
  }
myoptions_ = [];
@api get options() {
		return this.myoptions_;
	}
	set options(value) 
	{
		this.myoptions_ = value;
		this.setup();
	}

  @track options_ = [];
  @track isOpen = false;
  @api selectedPills = [];  //seperate from values, because for some reason pills use {label,name} while values uses {label:value}

  @api
  selectedValues(){
    var values = []
    this.options_.forEach(function(option) {
      if (option.selected === true) {
        values.push(option.value);
      }
    });
    return values;
  }
  @api
  selectedObjects(){
    var values = []
    this.options_.forEach(function(option) {
      if (option.selected === true) {
        values.push(option);
      }
    });
    return values;
  }
  @api
  value(){
    return this.selectedValues().join(';')
  }

  connectedCallback() {
   this.setup();
  }

  setup() {
 
	if (this.options && this.options.length){
		 //copy public attributes to private ones
		this.options_ = JSON.parse(JSON.stringify(this.options));
		this.selectedPills = this.getPillArray();
	} else{
		this.options_ = [];
	}
}

  get labelStyle() {
    return this.variant === 'label-hidden' ? ' slds-hide' : ' slds-form-element__label ' ;
  }

  get dropdownOuterStyle(){
    return 'slds-dropdown slds-dropdown_fluid slds-dropdown_length-5' + this.dropdownLength;
  }

  get mainDivClass(){
    var style = ' slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click ';
    return this.isOpen ? ' slds-is-open ' + style : style;
  }
  get hintText(){
    if (this.selectedPills.length === 0) {
      return "Select an option...";
    }
    return "";
  }

  openDropdown(){
    this.isOpen = true;
  }
  closeDropdown(){
    this.isOpen = false;
  }

  /* following pair of functions are a clever way of handling a click outside,
     despite us not having access to the outside dom.
     see: https://salesforce.stackexchange.com/questions/255691/handle-click-outside-element-in-lwc
     I made a slight improvement - by calling stopImmediatePropagation, I avoid the setTimeout call
     that the original makes to break the event flow.
  */
  handleClick(event){
    event.stopImmediatePropagation();
    this.openDropdown();
    window.addEventListener('click', this.handleClose);
  }
  handleClose = (event) => {
    event.stopPropagation();
    this.closeDropdown();
    window.removeEventListener('click', this.handleClose);
  }

  handlePillRemove(event){
    event.preventDefault();
    event.stopPropagation();

    const name = event.detail.item.name;
    //const index = event.detail.index;

    this.options_.forEach(function(element) {
      if (element.value === name) {
        element.selected = false;
      }
    });
    this.selectedPills = this.getPillArray();
    this.despatchChangeEvent();

  }

  despatchChangeEvent() {
    const eventDetail = {value:this.value(),selectedItems:this.selectedObjects()};
    const changeEvent = new CustomEvent('change', { detail: eventDetail });
    this.dispatchEvent(changeEvent);
  }

  handleSelectedClick(event){

    var value;
    var selected;
    event.preventDefault();
    event.stopPropagation();

    const listData = event.detail;
    //console.log(listData);

    value = listData.value;
    selected = listData.selected;

   
    this.options_.forEach(function(option) {
    if (option.value === value) {
        option.selected = selected === true ? false : true;
    } 
    });
    //this.closeDropdown();

    this.selectedPills = this.getPillArray();
	this.despatchChangeEvent();

  }

  getPillArray(){
    var pills = [];
    this.options_.forEach(function(element) {
      var interator = 0;
      if (element.selected) {
        pills.push({label:element.label, name:element.value, key: interator++});
      }
    });
    return pills;
  }

}