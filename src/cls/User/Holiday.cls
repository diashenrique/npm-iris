Class User.Holiday Extends (%Library.Persistent, %XML.Adaptor, %Library.Populate)
{

Property Calendar As User.Calendar;

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
<Value>Calendar</Value>
</Value>
<Value name="3">
<Value>Code</Value>
</Value>
<Value name="4">
<Value>HolidayDescription</Value>
</Value>
<Value name="5">
<Value>HolidayDate</Value>
</Value>
<Value name="6">
<Value>Remarks</Value>
</Value>
</Data>
<DataLocation>^User.HolidayD</DataLocation>
<DefaultData>HolidayDefaultData</DefaultData>
<IdLocation>^User.HolidayD</IdLocation>
<IndexLocation>^User.HolidayI</IndexLocation>
<StreamLocation>^User.HolidayS</StreamLocation>
<Type>%Library.CacheStorage</Type>
}

}
