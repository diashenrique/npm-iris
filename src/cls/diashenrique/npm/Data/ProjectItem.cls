Class diashenrique.npm.Data.ProjectItem Extends (%Persistent, %JSON.Adaptor)
{

Property Project As diashenrique.npm.Data.Project;

Property Code As %String;

Property Description As %String;

Property BeginDate As %Date;

Property EndDate As %Date;

// Property Owner As diashenrique.npm.Data.TeamMember;

Property Status As %String;

Property Priority As %List;

Index ProjectItemIndex On (Project, Code) [ IdKey, Unique ];

Storage Default
{
<Data name="ProjectItemDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>Description</Value>
</Value>
<Value name="3">
<Value>BeginDate</Value>
</Value>
<Value name="4">
<Value>EndDate</Value>
</Value>
<Value name="5">
<Value>Status</Value>
</Value>
<Value name="6">
<Value>Priority</Value>
</Value>
</Data>
<DataLocation>^diashenrique.n4900.ProjectItemD</DataLocation>
<DefaultData>ProjectItemDefaultData</DefaultData>
<IdLocation>^diashenrique.n4900.ProjectItemD</IdLocation>
<IndexLocation>^diashenrique.n4900.ProjectItemI</IndexLocation>
<StreamLocation>^diashenrique.n4900.ProjectItemS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
