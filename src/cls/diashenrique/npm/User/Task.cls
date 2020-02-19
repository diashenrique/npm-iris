Class diashenrique.npm.User.Task Extends (%Library.Persistent, %XML.Adaptor, %Library.Populate)
{

Property TaskName As %String [ Required ];

Property StartDate As %Date;

Property DueDate As %Date;

Property Progress As %Float;

Property Priority As %String;

Property Status As %String;

Property Estimate As %Float;

Property TrackingStatus As %String(DISPLAYLIST = ",Running,Stopped", VALUELIST = ",R,S") [ InitialExpression = "S" ];

Property AssignedUser As User.Person;

Property ParentId As User.Task;

Property PredecessorId As User.Task;

Property SucessorId As User.Task;

Property ProjectId As User.Project;

Index TaskIndex On TaskName [ Unique ];

Storage Default
{
<Data name="TaskDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>TaskName</Value>
</Value>
<Value name="3">
<Value>Description</Value>
</Value>
<Value name="4">
<Value>Active</Value>
</Value>
<Value name="5">
<Value>StartDate</Value>
</Value>
<Value name="6">
<Value>DueDate</Value>
</Value>
<Value name="7">
<Value>Progress</Value>
</Value>
<Value name="8">
<Value>Priority</Value>
</Value>
<Value name="9">
<Value>Status</Value>
</Value>
<Value name="10">
<Value>AssignedUser</Value>
</Value>
<Value name="11">
<Value>TaskParent</Value>
</Value>
<Value name="12">
<Value>PredecessorId</Value>
</Value>
<Value name="13">
<Value>SucessorId</Value>
</Value>
<Value name="14">
<Value>ParentId</Value>
</Value>
<Value name="15">
<Value>ProjectId</Value>
</Value>
<Value name="16">
<Value>Estimate</Value>
</Value>
<Value name="17">
<Value>TrackingStatus</Value>
</Value>
</Data>
<DataLocation>^User.TaskD</DataLocation>
<DefaultData>TaskDefaultData</DefaultData>
<IdLocation>^User.TaskD</IdLocation>
<IndexLocation>^User.TaskI</IndexLocation>
<StreamLocation>^User.TaskS</StreamLocation>
<Type>%Library.CacheStorage</Type>
}

}
