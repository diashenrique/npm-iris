/// Teams Definition 
Class diashenrique.npm.User.Team Extends (%Library.Persistent, %XML.Adaptor, %Library.Populate)
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
<DataLocation>^User.TeamD</DataLocation>
<DefaultData>TeamDefaultData</DefaultData>
<IdLocation>^User.TeamD</IdLocation>
<IndexLocation>^User.TeamI</IndexLocation>
<StreamLocation>^User.TeamS</StreamLocation>
<Type>%Library.CacheStorage</Type>
}

}
