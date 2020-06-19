({
	doInit : function(component, event, helper) {
        window.setTimeout(
            $A.getCallback(function() {
				let myviewer = component.find("my-viewer");
				myviewer.doOpen({'documentsaveFormulaField':'','documentsaveName':'Document.pdf','VFReportPageName':'AccountReport','modalTitle':'Account Report'});
				component.set("v.isLoading", false);
			}), 0
        );
    },
	handleClose : function(component, event, helper) {
		$A.get("e.force:closeQuickAction").fire();  
	}

})