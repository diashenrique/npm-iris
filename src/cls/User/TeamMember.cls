/// Members of the Teams
Class User.TeamMember Extends (%Library.Persistent, %XML.Adaptor, %Library.Populate)
{

Property Team As User.Team;

Property Member As User.Person;

Property Active As %Boolean;

Property Responsibility As %String;

/// Relationship ParentTeam As User.Team [ Cardinality = parent, Inverse = TeamMembers ];
/// Index TeamMemberParent On ParentTeam;
Index TeamMember On (Team, Member) [ IdKey, Unique ];

Storage Default
{
<Data name="TeamMemberDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>Active</Value>
</Value>
<Value name="3">
<Value>Responsibility</Value>
</Value>
</Data>
<DataLocation>^User.TeamMemberD</DataLocation>
<DefaultData>TeamMemberDefaultData</DefaultData>
<IdLocation>^User.TeamMemberD</IdLocation>
<IndexLocation>^User.TeamMemberI</IndexLocation>
<StreamLocation>^User.TeamMemberS</StreamLocation>
<Type>%Library.CacheStorage</Type>
}

}
