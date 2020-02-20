Class diashenrique.npm.Data.Holiday Extends (%Persistent, %JSON.Adaptor)
{

Property Calendar As diashenrique.npm.Data.Calendar;

Property Code As %String;

Property HolidayDescription As %String;

Property HolidayDate As %Date;

Property Remarks As %Stream;

Index HolidayIndex On (Calendar, Code) [ IdKey, Unique ];

Storage Default
{
<Data name="HolidayDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>HolidayDescription</Value>
</Value>
<Value name="3">
<Value>HolidayDate</Value>
</Value>
<Value name="4">
<Value>Remarks</Value>
</Value>
</Data>
<DataLocation>^diashenrique.npm.Data.HolidayD</DataLocation>
<DefaultData>HolidayDefaultData</DefaultData>
<IdLocation>^diashenrique.npm.Data.HolidayD</IdLocation>
<IndexLocation>^diashenrique.npm.Data.HolidayI</IndexLocation>
<StreamLocation>^diashenrique.npm.Data.HolidayS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
