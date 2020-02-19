Class diashenrique.npm.User.Calendar Extends (%Library.Persistent, %XML.Adaptor, %Library.Populate)
{

Property Code As %String;

Property Description As %String;

Property Active As %Boolean;

Property WorkDays As %List;

Property Remarks As %Stream;

Storage Default
{
<Data name="CalendarDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>Code</Value>
</Value>
<Value name="3">
<Value>Description</Value>
</Value>
<Value name="4">
<Value>Active</Value>
</Value>
<Value name="5">
<Value>WorkDays</Value>
</Value>
<Value name="6">
<Value>Remarks</Value>
</Value>
</Data>
<DataLocation>^User.CalendarD</DataLocation>
<DefaultData>CalendarDefaultData</DefaultData>
<IdLocation>^User.CalendarD</IdLocation>
<IndexLocation>^User.CalendarI</IndexLocation>
<StreamLocation>^User.CalendarS</StreamLocation>
<Type>%Library.CacheStorage</Type>
}

}
