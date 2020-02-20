Class diashenrique.npm.Data.Project Extends (%Persistent, %JSON.Adaptor)
{

Property Code As %String;

Property Description As %String;

Property Status As %String;

Property BeginDate As %Date;

Property EndDate As %Date;

Property Remarks As %String;

Storage Default
{
<Data name="ProjectDefaultData">
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
<Value>Status</Value>
</Value>
<Value name="5">
<Value>BeginDate</Value>
</Value>
<Value name="6">
<Value>EndDate</Value>
</Value>
<Value name="7">
<Value>Remarks</Value>
</Value>
</Data>
<DataLocation>^diashenrique.npm.Data.ProjectD</DataLocation>
<DefaultData>ProjectDefaultData</DefaultData>
<IdLocation>^diashenrique.npm.Data.ProjectD</IdLocation>
<IndexLocation>^diashenrique.npm.Data.ProjectI</IndexLocation>
<StreamLocation>^diashenrique.npm.Data.ProjectS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
