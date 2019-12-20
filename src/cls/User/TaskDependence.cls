Class User.TaskDependence Extends (%Library.Persistent, %XML.Adaptor, %Library.Populate)
{

Property PredecessorId As User.Task;

Property SucessorId As User.Task;

Property Type As %Integer;

Property ProjectId As User.Project;

Storage Default
{
<Data name="TaskDependenceDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>TaskId</Value>
</Value>
<Value name="3">
<Value>PredecessorId</Value>
</Value>
<Value name="4">
<Value>SucessorId</Value>
</Value>
<Value name="5">
<Value>Type</Value>
</Value>
<Value name="6">
<Value>ProjectId</Value>
</Value>
</Data>
<DataLocation>^User.TaskDependenceD</DataLocation>
<DefaultData>TaskDependenceDefaultData</DefaultData>
<IdLocation>^User.TaskDependenceD</IdLocation>
<IndexLocation>^User.TaskDependenceI</IndexLocation>
<StreamLocation>^User.TaskDependenceS</StreamLocation>
<Type>%Library.CacheStorage</Type>
}

}
