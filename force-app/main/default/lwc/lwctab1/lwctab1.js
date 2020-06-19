import { LightningElement, wire, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import getScheduledJobs from "@salesforce/apex/lwctab1Controller.getScheduledJobs";
import getApexJobs from "@salesforce/apex/lwctab1Controller.getApexJobs";
import getAccounts from "@salesforce/apex/lwctab1Controller.getAccounts";

import sresource from "@salesforce/resourceUrl/lwcJS";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";

import { NavigationMixin } from "lightning/navigation";

export default class Lwctab1 extends NavigationMixin(LightningElement) {
  @track showSpinner = true;
  @track error;
  hasInitialized = false;
  @track initialLoadComplete = false;
  @track momentjs1;

  renderedCallback() {
    if (this.hasInitialized) {
      return;
    }
    this.hasInitialized = true;
    
		Promise.all([
		  loadScript(this, sresource + "/moment.js"),
		  loadStyle(this, sresource + "/custom1.css")
		])
		  .then(() => {
			this.momentjs1 = moment();
			this.getdata();
			this.initialLoadComplete = true;
		  })
		  .catch((error) => {
			console.log("load error: " + error);
			this.dispatchEvent(
			  new ShowToastEvent({
				title: "Error loading",
				message: error.message,
				variant: "error"
			  })
			);
		  });
	  

    //this.getdata();
    //this.initialLoadComplete = true;
  }

  getdata() {
    getScheduledJobs({})
      .then((data) => {
        if (data) {
          let parseData = JSON.parse(JSON.stringify(data));
          let itemdata = [];

          for (let row of parseData) {
            //tranform data  if needed
            row.CronJobDetailName = this.getProperty(
              row,
              "CronJobDetail.Name",
              ""
            );
            itemdata.push(row);
          }
          console.log({
            log: "getScheduledJobs",
            data: JSON.parse(JSON.stringify(data)),
            itemdata: itemdata
          });

          this.scheduleInfo.totalRecountCount = itemdata.length;
          this.scheduleInfo.totalPage = Math.ceil(
            this.scheduleInfo.totalRecountCount /
              this.scheduleInfo.pageSizeValue
          );
          this.scheduleInfo.page = 1;

          //setting default sort
          if (!this.scheduleInfo.sortBy)
            this.scheduleInfo.sortBy = "NextFireTime";
          if (!this.scheduleInfo.sortDirection)
            this.scheduleInfo.sortDirection = "desc";
          this.scheduleInfo.items = this.sortData(
            this.scheduleInfo.sortBy,
            this.scheduleInfo.sortDirection,
            itemdata
          );

          this.displayRecordPerPage(this.scheduleInfo.page, this.scheduleInfo);
        }
        this.showSpinner = false;
      })
      .catch((error) => {
        let myerror = error.message ? error.message : JSON.stringify(error);

        console.log({ log: "getScheduledJobs", error: error });
        this.error = myerror;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Alert",
            message: myerror,
            variant: "error"
          })
        );
        this.showSpinner = false;
      });

    getApexJobs()
      .then((data) => {
        if (data) {
          let parseData = JSON.parse(JSON.stringify(data));
          let itemdata = [];

          for (let row of parseData) {
            //tranform data  if needed
            row.ApexClassName = this.getProperty(row, "ApexClass.Name", "");
            itemdata.push(row);
          }
          console.log({
            log: "getApexJobs",
            data: JSON.parse(JSON.stringify(data)),
            itemdata: itemdata
          });
          this.apexjobInfo.totalRecountCount = itemdata.length;
          this.apexjobInfo.totalPage = Math.ceil(
            this.apexjobInfo.totalRecountCount / this.apexjobInfo.pageSizeValue
          );
          this.apexjobInfo.page = 1;

          //setting default sort
          if (!this.apexjobInfo.sortBy) this.apexjobInfo.sortBy = "CreatedDate";
          if (!this.apexjobInfo.sortDirection)
            this.apexjobInfo.sortDirection = "desc";
          this.apexjobInfo.items = this.sortData(
            this.apexjobInfo.sortBy,
            this.apexjobInfo.sortDirection,
            itemdata
          );

          this.displayRecordPerPage(this.apexjobInfo.page, this.apexjobInfo);
        }
        this.showSpinner = false;
      })
      .catch((error) => {
        let myerror = error.message ? error.message : JSON.stringify(error);

        console.log({ log: "getApexJobs", error: error });
        this.error = myerror;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Alert",
            message: myerror,
            variant: "error"
          })
        );
        this.showSpinner = false;
      });

    getAccounts()
      .then((data) => {
        if (data) {
          let parseData = JSON.parse(JSON.stringify(data));
          let itemdata = [];

          for (let row of parseData) {
            //tranform data  if needed
            itemdata.push(row);
          }
          console.log({
            log: "getAccounts",
            data: JSON.parse(JSON.stringify(data)),
            itemdata: itemdata
          });
          this.accountInfo.totalRecountCount = itemdata.length;
          this.accountInfo.totalPage = Math.ceil(
            this.accountInfo.totalRecountCount / this.accountInfo.pageSizeValue
          );
          this.accountInfo.page = 1;

          //setting default sort
          if (!this.accountInfo.sortBy) this.accountInfo.sortBy = "CreatedDate";
          if (!this.accountInfo.sortDirection)
            this.accountInfo.sortDirection = "desc";
          this.accountInfo.items = this.sortData(
            this.accountInfo.sortBy,
            this.accountInfo.sortDirection,
            itemdata
          );

          this.displayRecordPerPage(this.accountInfo.page, this.accountInfo);
        }
        this.showSpinner = false;
      })
      .catch((error) => {
        let myerror = error.message ? error.message : JSON.stringify(error);

        console.log({ log: "getAccounts", error: error });
        this.error = myerror;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Alert",
            message: myerror,
            variant: "error"
          })
        );
        this.showSpinner = false;
      });
  }

  @track scheduleInfo = {
    columns: [
      {
        label: "Name",
        fieldName: "CronJobDetailName",
        type: "string",
        sortable: true,
        cellAttributes: { alignment: "left", wrapText: true }
      },
      {
        label: "Next Fire Time",
        fieldName: "NextFireTime",
        type: "date",
        sortable: true,
        cellAttributes: { alignment: "left", wrapText: true },
        typeAttributes: {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        }
      },
      {
        label: "Previous Fire Time",
        fieldName: "PreviousFireTime",
        type: "date",
        sortable: true,
        cellAttributes: { alignment: "left", wrapText: true },
        typeAttributes: {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        }
      },
      {
        label: "CronExpression",
        fieldName: "CronExpression",
        type: "string",
        sortable: true,
        cellAttributes: { alignment: "left", wrapText: true }
      }
    ],
    data: [],
    newScheduleInfo: { name: "", hour: 0, minute: 0 },
    items: [],
    sortBy: undefined,
    sortDirection: undefined,
    startingRecord: 1,
    endingRecord: 0,
    pageSizeValue: 5,
    totalRecountCount: 0,
    totalPage: 0,
    page: 1,
    opeModal: false,
    previousHandler: function (event) {
      this.previousHandler(this.scheduleInfo);
    },
    nextHandler: function (event) {
      this.nextHandler(this.scheduleInfo);
    },
    firstHandler: function (event) {
      this.firstHandler(this.scheduleInfo);
    },
    lastHandler: function (event) {
      this.lastHandler(this.scheduleInfo);
    },
    handleSortdata: function (event) {
      this.handleSortdata(event, this.scheduleInfo);
    },
    handlepagesizechanged(event) {
      this.handlepagesizechanged(event, this.scheduleInfo);
    },
    handleViewAllSchedule(event) {
      this.myPageRef = {
        type: "standard__webPage",
        attributes: {
          url: "/lightning/setup/ScheduledJobs/home"
        }
      };
      this[NavigationMixin.GenerateUrl](this.myPageRef).then((url) =>
        window.open(url, "_blank")
      );
    }
  };

  @track apexjobInfo = {
    columns: [
      {
        label: "CreatedDate",
        fieldName: "CreatedDate",
        type: "date",
        sortable: true,
        cellAttributes: { alignment: "left", wrapText: true },
        typeAttributes: {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        }
      },
      {
        label: "JobType",
        fieldName: "JobType",
        type: "string",
        sortable: true,
        cellAttributes: { alignment: "left", wrapText: true }
      },
      {
        label: "ApexClass",
        fieldName: "ApexClassName",
        type: "string",
        sortable: true,
        cellAttributes: { alignment: "left", wrapText: true }
      },
      {
        label: "Status",
        fieldName: "Status",
        type: "string",
        sortable: true,
        cellAttributes: { alignment: "left", wrapText: true }
      },
      {
        label: "NumberOfErrors",
        fieldName: "NumberOfErrors",
        type: "number",
        sortable: true,
        cellAttributes: { alignment: "left", wrapText: true }
      },
      {
        label: "ExtendedStatus",
        fieldName: "ExtendedStatus",
        type: "string",
        sortable: true,
        cellAttributes: { alignment: "left", wrapText: true }
      },
      {
        label: "CompletedDate",
        fieldName: "CompletedDate",
        type: "date",
        sortable: true,
        cellAttributes: { alignment: "left", wrapText: true },
        typeAttributes: {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        }
      }
    ],
    data: [],
    items: [],
    sortBy: undefined,
    sortDirection: undefined,
    startingRecord: 1,
    endingRecord: 0,
    pageSizeValue: 5,
    totalRecountCount: 0,
    totalPage: 0,
    page: 1,
    previousHandler: function (event) {
      this.previousHandler(this.apexjobInfo);
    },
    nextHandler: function (event) {
      this.nextHandler(this.apexjobInfo);
    },
    firstHandler: function (event) {
      this.firstHandler(this.apexjobInfo);
    },
    lastHandler: function (event) {
      this.lastHandler(this.apexjobInfo);
    },
    handleSortdata: function (event) {
      this.handleSortdata(event, this.apexjobInfo);
    },
    handlepagesizechanged(event) {
      this.handlepagesizechanged(event, this.apexjobInfo);
    },
    handleViewAll(event) {
      this.myPageRef = {
        type: "standard__webPage",
        attributes: {
          url: "/lightning/setup/AsyncApexJobs/home"
        }
      };
      this[NavigationMixin.GenerateUrl](this.myPageRef).then((url) =>
        window.open(url, "_blank")
      );
    }
  };

  handleRefreshPage = function (event) {
    this.showSpinner = true;
    this.getdata();
  };

  @track accountInfo = {
    columns: [
      {
        label: "CreatedDate",
        fieldName: "CreatedDate",
        type: "date",
        sortable: true,
        cellAttributes: { alignment: "left", wrapText: true },
        typeAttributes: {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        }
      },
      {
        label: "Name",
        fieldName: "Name",
        type: "string",
        sortable: true,
        cellAttributes: { alignment: "left", wrapText: true }
      }
    ],
    data: [],
    items: [],
    sortBy: undefined,
    sortDirection: undefined,
    startingRecord: 1,
    endingRecord: 0,
    pageSizeValue: 5,
    totalRecountCount: 0,
    totalPage: 0,
    page: 1,
    previousHandler: function (event) {
      this.previousHandler(this.apexjobInfo);
    },
    nextHandler: function (event) {
      this.nextHandler(this.apexjobInfo);
    },
    firstHandler: function (event) {
      this.firstHandler(this.apexjobInfo);
    },
    lastHandler: function (event) {
      this.lastHandler(this.apexjobInfo);
    },
    handleSortdata: function (event) {
      this.handleSortdata(event, this.apexjobInfo);
    },
    handlepagesizechanged(event) {
      this.handlepagesizechanged(event, this.apexjobInfo);
    },
    handleViewAll(event) {
      this.myPageRef = {
        type: "standard__objectPage",
        attributes: {
          objectApiName: "Account",
          actionName: "home"
        },
        state: {
          // 'filterName' is a property on the page 'state'
          // and identifies the target list view.
          // It may also be an 18 character list view id.
          filterName: "00B3h000005sRR4EAM" // or by 18 char '00BT0000002TONQMA4'
        }
      };
      this[NavigationMixin.GenerateUrl](this.myPageRef).then((url) =>
        window.open(url, "_blank")
      );
    }
  };

  handleRefreshPage = function (event) {
    this.showSpinner = true;
    this.getdata();
  };

  handleShowSettings = function (event) {
    window.open("/lightning/setup/CustomMetadata/home", "_blank");
  };

  /* ex: getProperty(myObj,'aze.xyz',0) // return myObj.aze.xyz safely
   * accepts array for property names:
   *     getProperty(myObj,['aze','xyz'],{value: null})
   */
  getProperty(obj, props, defaultValue) {
    var res,
      isvoid = function (x) {
        return typeof x === "undefined" || x === null;
      };
    if (!isvoid(obj)) {
      if (isvoid(props)) props = [];
      if (typeof props === "string") props = props.trim().split(".");
      if (props.constructor === Array) {
        res =
          props.length > 1
            ? this.getProperty(obj[props.shift()], props, defaultValue)
            : obj[props[0]];
      }
    }
    return typeof res === "undefined" ? defaultValue : res;
  }

  previousHandler = function (myinfo) {
    if (myinfo.page > 1) {
      myinfo.page = myinfo.page - 1; //decrease page by 1
      this.displayRecordPerPage(myinfo.page, myinfo);
    }
  };

  nextHandler = function (myinfo) {
    if (myinfo.page < myinfo.totalPage && myinfo.page !== myinfo.totalPage) {
      myinfo.page = myinfo.page + 1; //increase page by 1
      this.displayRecordPerPage(myinfo.page, myinfo);
    }
  };

  firstHandler = function (myinfo) {
    myinfo.page = 1;
    this.displayRecordPerPage(myinfo.page, myinfo);
  };

  lastHandler = function (myinfo) {
    myinfo.page = myinfo.totalPage;
    this.displayRecordPerPage(myinfo.page, myinfo);
  };

  displayRecordPerPage = function (page, t) {
    /*let's say for 2nd page, it will be => "Displaying 6 to 10 of 23 records. Page 2 of 5"
		page = 2; pageSize = 5; startingRecord = 5, endingRecord = 10
		so, slice(5,10) will give 5th to 9th records.
		*/
    t.startingRecord = (page - 1) * t.pageSizeValue;
    t.endingRecord = t.pageSizeValue * page;

    t.endingRecord =
      t.endingRecord > t.totalRecountCount
        ? t.totalRecountCount
        : t.endingRecord;

    t.data = t.items.slice(t.startingRecord, t.endingRecord);

    //increment by 1 to display the startingRecord count,
    //so for 2nd page, it will show "Displaying 6 to 10 of 23 records. Page 2 of 5"
    t.startingRecord = t.startingRecord + 1;
  };

  handleSortdata = function (event, myinfo) {
    // field name
    myinfo.sortBy = event.detail.fieldName;
    // sort direction
    myinfo.sortDirection = event.detail.sortDirection;
    // calling sortdata function to sort the data based on direction and selected field
    myinfo.items = this.sortData(
      event.detail.fieldName,
      event.detail.sortDirection,
      myinfo.items
    );
    this.displayRecordPerPage(myinfo.page, myinfo);
  };

  handlepagesizechanged = function (event, myinfo) {
    event.stopPropagation();
    let receivedData = JSON.parse(JSON.stringify(event.detail.data));
    myinfo.pageSizeValue = receivedData.pagesize;

    myinfo.totalRecountCount = myinfo.items.length;
    myinfo.totalPage = Math.ceil(
      myinfo.totalRecountCount / this.data.pageSizeValue
    );
    myinfo.page = 1;
    this.displayRecordPerPage(myinfo.page, myinfo);
  };

  sortData = function (fieldname, direction, tdata) {
    // serialize the data before calling sort function
    let parseData = JSON.parse(JSON.stringify(tdata));

    // Return the value stored in the field
    let keyValue = (a) => {
      return a[fieldname];
    };

    // cheking reverse direction
    let isReverse = direction === "asc" ? 1 : -1;

    // sorting data
    parseData.sort((x, y) => {
      x = keyValue(x) ? keyValue(x) : ""; // handling null values
      y = keyValue(y) ? keyValue(y) : "";

      // sorting values based on direction
      return isReverse * ((x > y) - (y > x));
    });

    // set the sorted data to data table data
    return parseData;
  };
}