/// System Users 
Class diashenrique.npm.User.Person Extends (%Library.Persistent, %XML.Adaptor, %Library.Populate) [ ClassType = persistent ]
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
<Value>Active</Value>
</Value>
<Value name="7">
<Value>Password</Value>
</Value>
<Value name="8">
<Value>JobTitle</Value>
</Value>
<Value name="9">
<Value>Company</Value>
</Value>
<Value name="10">
<Value>ProfileHeading</Value>
</Value>
<Value name="11">
<Value>PhotoProfile</Value>
</Value>
</Data>
<DataLocation>^User.PersonD</DataLocation>
<DefaultData>PersonDefaultData</DefaultData>
<ExtentSize>20</ExtentSize>
<IdLocation>^User.PersonD</IdLocation>
<IndexLocation>^User.PersonI</IndexLocation>
<Property name="%%CLASSNAME">
<AverageFieldSize>1</AverageFieldSize>
<Selectivity>100.0000%</Selectivity>
</Property>
<Property name="%%ID">
<AverageFieldSize>1.55</AverageFieldSize>
<Selectivity>1</Selectivity>
</Property>
<Property name="Active">
<AverageFieldSize>1</AverageFieldSize>
<Selectivity>50.0000%</Selectivity>
</Property>
<Property name="Company">
<AverageFieldSize>14.8</AverageFieldSize>
<Selectivity>5.0000%</Selectivity>
</Property>
<Property name="DateOfBirth">
<AverageFieldSize>5</AverageFieldSize>
<Selectivity>5.0000%</Selectivity>
</Property>
<Property name="JobTitle">
<AverageFieldSize>20.85</AverageFieldSize>
<Selectivity>5.0000%</Selectivity>
</Property>
<Property name="Name">
<AverageFieldSize>19.8</AverageFieldSize>
<Selectivity>5.0000%</Selectivity>
</Property>
<Property name="Password">
<AverageFieldSize>4.95</AverageFieldSize>
<Selectivity>5.0000%</Selectivity>
</Property>
<Property name="PhotoProfile">
<AverageFieldSize>4.95</AverageFieldSize>
<Selectivity>5.0000%</Selectivity>
</Property>
<Property name="ProfileHeading">
<AverageFieldSize>13.4</AverageFieldSize>
<Selectivity>8.3333%</Selectivity>
</Property>
<Property name="UserName">
<AverageFieldSize>11.95</AverageFieldSize>
<Selectivity>1</Selectivity>
</Property>
<Property name="email">
<AverageFieldSize>23.65</AverageFieldSize>
<Selectivity>5.0000%</Selectivity>
</Property>
<SQLMap name="IDKEY">
<BlockCount>-4</BlockCount>
</SQLMap>
<SQLMap name="UserNameIndex">
<BlockCount>-4</BlockCount>
</SQLMap>
<StreamLocation>^User.PersonS</StreamLocation>
<Type>%Library.CacheStorage</Type>
}

}
