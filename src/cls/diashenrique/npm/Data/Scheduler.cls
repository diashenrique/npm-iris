Class diashenrique.npm.Data.Scheduler Extends (%Persistent, %JSON.Adaptor)
{

Property Description As %String;

Property StartDate As %DateTime;

Property EndDate As %DateTime;

Property AllDay As %Boolean;

Property RecurrenceRule As %String;

Property Priority As %String;

Storage Default
{
<Data name="SchedulerDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>Description</Value>
</Value>
<Value name="3">
<Value>StartDate</Value>
</Value>
<Value name="4">
<Value>EndDate</Value>
</Value>
<Value name="5">
<Value>AllDay</Value>
</Value>
<Value name="6">
<Value>RecurrenceRule</Value>
</Value>
<Value name="7">
<Value>Priority</Value>
</Value>
</Data>
<DataLocation>^diashenrique.npm4900.SchedulerD</DataLocation>
<DefaultData>SchedulerDefaultData</DefaultData>
<IdLocation>^diashenrique.npm4900.SchedulerD</IdLocation>
<IndexLocation>^diashenrique.npm4900.SchedulerI</IndexLocation>
<StreamLocation>^diashenrique.npm4900.SchedulerS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
