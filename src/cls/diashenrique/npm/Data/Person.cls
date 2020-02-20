/// System Users 
Class diashenrique.npm.Data.Person Extends (%Persistent, %JSON.Adaptor)
{

Property UserName As %String [ Required ];

Property Name As %String;

Property email As %String;

Property DateOfBirth As %Date;

Property JobTitle As %String;

Property Company As %String;

Property ProfileHeading As %String;

Property PhotoProfile As %String;

Property Active As %Boolean;

Property Password As %String;

Index UserNameIndex On UserName [ Unique ];

Storage Default
{
<Data name="PersonDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>UserName</Value>
</Value>
<Value name="3">
<Value>Name</Value>
</Value>
<Value name="4">
<Value>email</Value>
</Value>
<Value name="5">
<Value>DateOfBirth</Value>
</Value>
<Value name="6">
<Value>JobTitle</Value>
</Value>
<Value name="7">
<Value>Company</Value>
</Value>
<Value name="8">
<Value>ProfileHeading</Value>
</Value>
<Value name="9">
<Value>PhotoProfile</Value>
</Value>
<Value name="10">
<Value>Active</Value>
</Value>
<Value name="11">
<Value>Password</Value>
</Value>
</Data>
<DataLocation>^diashenrique.npm.Data.PersonD</DataLocation>
<DefaultData>PersonDefaultData</DefaultData>
<IdLocation>^diashenrique.npm.Data.PersonD</IdLocation>
<IndexLocation>^diashenrique.npm.Data.PersonI</IndexLocation>
<StreamLocation>^diashenrique.npm.Data.PersonS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
