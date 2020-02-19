Class diashenrique.npm.User.Scheduler Extends (%Library.Persistent, %XML.Adaptor, %Library.Populate)
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
<DataLocation>^User.SchedulerD</DataLocation>
<DefaultData>SchedulerDefaultData</DefaultData>
<IdLocation>^User.SchedulerD</IdLocation>
<IndexLocation>^User.SchedulerI</IndexLocation>
<StreamLocation>^User.SchedulerS</StreamLocation>
<Type>%Library.CacheStorage</Type>
}

}
