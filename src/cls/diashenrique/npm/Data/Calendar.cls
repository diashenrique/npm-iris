Class diashenrique.npm.Data.Calendar Extends (%Persistent, %JSON.Adaptor)
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
<DataLocation>^diashenrique.npm4900.CalendarD</DataLocation>
<DefaultData>CalendarDefaultData</DefaultData>
<IdLocation>^diashenrique.npm4900.CalendarD</IdLocation>
<IndexLocation>^diashenrique.npm4900.CalendarI</IndexLocation>
<StreamLocation>^diashenrique.npm4900.CalendarS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
