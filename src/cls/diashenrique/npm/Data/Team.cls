/// Teams Definition 
Class diashenrique.npm.Data.Team Extends (%Persistent, %JSON.Adaptor)
{

Property TeamName As %String [ Required ];

Property Description As %String;

Property Active As %Boolean;

// Relationship TeamMembers As User.TeamMember [ Cardinality = children, Inverse = ParentTeam ];

Index TeamNameIndex On TeamName [ Unique ];

Storage Default
{
<Data name="TeamDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>TeamName</Value>
</Value>
<Value name="3">
<Value>Description</Value>
</Value>
<Value name="4">
<Value>Active</Value>
</Value>
</Data>
<DataLocation>^diashenrique.npm.Data.TeamD</DataLocation>
<DefaultData>TeamDefaultData</DefaultData>
<IdLocation>^diashenrique.npm.Data.TeamD</IdLocation>
<IndexLocation>^diashenrique.npm.Data.TeamI</IndexLocation>
<StreamLocation>^diashenrique.npm.Data.TeamS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
