import { LightningElement, api, wire, track } from 'lwc';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import AccountObject from '@salesforce/schema/Account';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Lwctab2 extends LightningElement {

@track accountRecordTypesOptions = [{ label: '', value: '', selected: false }];

@track accountRecType;


@track accountRecTypeSelectedValues;


 @wire(getObjectInfo, { objectApiName: AccountObject })
    handleResult({ error, data }) {
        if (data) {
            this.accountRecType = data.defaultRecordTypeId;
			let optionsValues = [];
            // map of record type Info
            const rtInfos = data.recordTypeInfos;
            // getting map values
            let rtValues = Object.values(rtInfos);
			let mycookie = this.getCookie('lwctab2AccountRecordTypes');
			var anomtypes = [];
			if (mycookie)
			{
				anomtypes = mycookie.split(';');
			}

            for(let i = 0; i < rtValues.length; i++) {
                if(rtValues[i].name !== 'Master') {
                    optionsValues.push({
                        label: rtValues[i].name,
                        value: rtValues[i].recordTypeId,
						selected: anomtypes.indexOf(rtValues[i].recordTypeId) !== -1 
                    })
                }
            }
			if (optionsValues.length > 0){
				this.accountRecordTypesOptions = optionsValues;
			}else{
				this.accountRecordTypesOptions  = [{ label: '', value: '', selected: false }];
			}
        } else {
            this.error = error;
        }
    }

	handlechange(event){
		this.accountRecTypeSelectedValues = event.detail.value;
		this.savecookies();
	}

	savecookies()
	{	
		this.createCookie('lwctab2AccountRecordTypes', (this.accountRecTypeSelectedValues ? this.accountRecTypeSelectedValues  : '') , 30);
	}

	createCookie(name, value, days) {
		var expires;
		if (days) {
			const date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toGMTString();
		}
		else {
			expires = "";
		}
		document.cookie = this.cookieprefix + name + "=" + escape(value) + expires + "; path=/";
	}

	getCookie(name) {
		var cookieString = "; " + document.cookie;
		var parts = cookieString.split("; " + this.cookieprefix + name + "=");
		if (parts.length === 2) {
			return decodeURIComponent(parts.pop().split(";").shift());
		}
		return null;
	}

}