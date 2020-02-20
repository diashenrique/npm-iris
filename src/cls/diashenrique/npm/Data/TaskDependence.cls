Class diashenrique.npm.Data.TaskDependence Extends (%Persistent, %JSON.Adaptor)
{

Property PredecessorId As diashenrique.npm.Data.Task;

Property SucessorId As diashenrique.npm.Data.Task;

Property Type As %Integer;

Property ProjectId As diashenrique.npm.Data.Project;

Storage Default
{
<Data name="TaskDependenceDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>PredecessorId</Value>
</Value>
<Value name="3">
<Value>SucessorId</Value>
</Value>
<Value name="4">
<Value>Type</Value>
</Value>
<Value name="5">
<Value>ProjectId</Value>
</Value>
</Data>
<DataLocation>^diashenriqu4900.TaskDependenceD</DataLocation>
<DefaultData>TaskDependenceDefaultData</DefaultData>
<IdLocation>^diashenriqu4900.TaskDependenceD</IdLocation>
<IndexLocation>^diashenriqu4900.TaskDependenceI</IndexLocation>
<StreamLocation>^diashenriqu4900.TaskDependenceS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
