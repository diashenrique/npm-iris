Class User.ProjectItem Extends (%Library.Persistent, %XML.Adaptor, %Library.Populate)
{

Property Project As User.Project;

Property Code As %String;

Property Description As %String;

Property BeginDate As %Date;

Property EndDate As %Date;

Property Owner As User.TeamMember;

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
<Value>Project</Value>
</Value>
<Value name="3">
<Value>Code</Value>
</Value>
<Value name="4">
<Value>Description</Value>
</Value>
<Value name="5">
<Value>BeginDate</Value>
</Value>
<Value name="6">
<Value>EndDate</Value>
</Value>
<Value name="7">
<Value>Owner</Value>
</Value>
<Value name="8">
<Value>Status</Value>
</Value>
<Value name="9">
<Value>Priority</Value>
</Value>
</Data>
<DataLocation>^User.ProjectItemD</DataLocation>
<DefaultData>ProjectItemDefaultData</DefaultData>
<IdLocation>^User.ProjectItemD</IdLocation>
<IndexLocation>^User.ProjectItemI</IndexLocation>
<StreamLocation>^User.ProjectItemS</StreamLocation>
<Type>%Library.CacheStorage</Type>
}

}
