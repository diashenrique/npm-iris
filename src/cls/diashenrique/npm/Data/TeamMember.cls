/// Members of the Teams
Class diashenrique.npm.Data.TeamMember Extends (%Persistent, %JSON.Adaptor)
{

Property Team As diashenrique.npm.Data.Team;

Property Member As diashenrique.npm.Data.Person;

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
<DataLocation>^diashenrique.np4900.TeamMemberD</DataLocation>
<DefaultData>TeamMemberDefaultData</DefaultData>
<IdLocation>^diashenrique.np4900.TeamMemberD</IdLocation>
<IndexLocation>^diashenrique.np4900.TeamMemberI</IndexLocation>
<StreamLocation>^diashenrique.np4900.TeamMemberS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
