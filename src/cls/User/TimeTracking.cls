Class User.TimeTracking Extends (%Library.Persistent, %XML.Adaptor)
{

Property TaskId As User.Task;

Property UserId As User.Person;

Property StartTracking As %TimeStamp;

Property EndTracking As %TimeStamp;

Property TotalTime As %Float;

Property LogWork As %Float;

Query TotalTimeByTaskId(pTaskId As %Integer) As %SQLQuery(COMPILEMODE = "IMMEDIATE", CONTAINID = 1, ROWSPEC = "TotalTime:%Integer", SELECTMODE = "RUNTIME") [ SqlName = TotalTimeByTaskId, SqlProc ]
{
SELECT SUM({fn TIMESTAMPDIFF(SQL_TSI_SECOND, StartTracking, EndTracking)}) as TotalTime FROM SQLUser.TimeTracking WHERE (TaskId = :pTaskId) GROUP BY TaskId
}

Query TotalTimeByTaskUser(pTaskId As %Integer, pUserId As %Integer) As %SQLQuery(COMPILEMODE = "IMMEDIATE", CONTAINID = 1, ROWSPEC = "TotalTime:%Integer", SELECTMODE = "RUNTIME") [ SqlName = TotalTimeByTaskUser, SqlProc ]
{
SELECT SUM({fn TIMESTAMPDIFF(SQL_TSI_SECOND, StartTracking, EndTracking)}) as TotalTime FROM SQLUser.TimeTracking WHERE (TaskId = :pTaskId) AND (UserId = :pUserId) GROUP BY TaskId
}

Index TaskIndex On TaskId;

Storage Default
{
<Data name="TimeTrackingDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>TaskId</Value>
</Value>
<Value name="3">
<Value>StartTracking</Value>
</Value>
<Value name="4">
<Value>EndTracking</Value>
</Value>
<Value name="5">
<Value>TotalTime</Value>
</Value>
<Value name="6">
<Value>LogWork</Value>
</Value>
<Value name="7">
<Value>UserId</Value>
</Value>
</Data>
<DataLocation>^User.TimeTrackingD</DataLocation>
<DefaultData>TimeTrackingDefaultData</DefaultData>
<IdLocation>^User.TimeTrackingD</IdLocation>
<IndexLocation>^User.TimeTrackingI</IndexLocation>
<StreamLocation>^User.TimeTrackingS</StreamLocation>
<Type>%Library.CacheStorage</Type>
}

}
