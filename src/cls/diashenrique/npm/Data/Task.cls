Class diashenrique.npm.Data.Task Extends (%Persistent, %JSON.Adaptor)
{

Property TaskName As %String [ Required ];

Property StartDate As %Date;

Property DueDate As %Date;

Property Progress As %Float;

Property Priority As %String;

Property Status As %String;

Property Estimate As %Float;

Property TrackingStatus As %String(DISPLAYLIST = ",Running,Stopped", VALUELIST = ",R,S") [ InitialExpression = "S" ];

Property AssignedUser As diashenrique.npm.Data.Person;

Property ParentId As diashenrique.npm.Data.Task;

Property PredecessorId As diashenrique.npm.Data.Task;

Property SucessorId As diashenrique.npm.Data.Task;

Property ProjectId As diashenrique.npm.Data.Project;

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
<Value>StartDate</Value>
</Value>
<Value name="4">
<Value>DueDate</Value>
</Value>
<Value name="5">
<Value>Progress</Value>
</Value>
<Value name="6">
<Value>Priority</Value>
</Value>
<Value name="7">
<Value>Status</Value>
</Value>
<Value name="8">
<Value>Estimate</Value>
</Value>
<Value name="9">
<Value>TrackingStatus</Value>
</Value>
<Value name="10">
<Value>AssignedUser</Value>
</Value>
<Value name="11">
<Value>ParentId</Value>
</Value>
<Value name="12">
<Value>PredecessorId</Value>
</Value>
<Value name="13">
<Value>SucessorId</Value>
</Value>
<Value name="14">
<Value>ProjectId</Value>
</Value>
</Data>
<DataLocation>^diashenrique.npm.Data.TaskD</DataLocation>
<DefaultData>TaskDefaultData</DefaultData>
<IdLocation>^diashenrique.npm.Data.TaskD</IdLocation>
<IndexLocation>^diashenrique.npm.Data.TaskI</IndexLocation>
<StreamLocation>^diashenrique.npm.Data.TaskS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
