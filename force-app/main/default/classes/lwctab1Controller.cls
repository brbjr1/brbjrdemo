public inherited sharing class lwctab1Controller {

	@AuraEnabled
	public static list<Sobject> getScheduledJobs()
	{
		return[SELECT ID, CronExpression, CronJobDetail.JobType, CronJobDetail.Name, CronJobDetailId, EndTime, NextFireTime, PreviousFireTime, StartTime, State, TimesTriggered FROM CronTrigger where CronJobDetail.Name like '%OP_IntegrationBatch%' order by NextFireTime desc];
	}

	@AuraEnabled
	public static list<Sobject> getApexJobs()
	{
		return[SELECT Id, CreatedDate, CreatedById, JobType, ApexClass.Name, ApexClassId, Status, JobItemsProcessed, TotalJobItems, NumberOfErrors, CompletedDate, MethodName, ExtendedStatus, ParentJobId, LastProcessed, LastProcessedOffset FROM AsyncApexJob where ApexClass.Name like '%OP_IntegrationBatch%' order by CompletedDate desc limit 100];
	}

	@AuraEnabled
	public static list<Sobject> getAccounts()
	{
		return[SELECT Id, Name,CreatedDate FROM Account];
	}

}