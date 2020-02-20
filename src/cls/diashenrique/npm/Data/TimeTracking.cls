Class diashenrique.npm.Data.TimeTracking Extends (%Persistent, %JSON.Adaptor)
{

Property TaskId As diashenrique.npm.Data.Task;

Property UserId As diashenrique.npm.Data.Person;

Property StartTracking As %TimeStamp;

Property EndTracking As %TimeStamp;

Property TotalTime As %Float;

Property LogWork As %Float;

Query TotalTimeByTaskId(pTaskId As %Integer) As %SQLQuery(COMPILEMODE = "IMMEDIATE", CONTAINID = 1, ROWSPEC = "TotalTime:%Integer", SELECTMODE = "RUNTIME") [ SqlName = TotalTimeByTaskId, SqlProc ]
{
SELECT SUM({fn TIMESTAMPDIFF(SQL_TSI_SECOND, StartTracking, EndTracking)}) as TotalTime FROM diashenrique_npm_Data.TimeTracking WHERE (TaskId = :pTaskId) GROUP BY TaskId
}

Query TotalTimeByTaskUser(pTaskId As %Integer, pUserId As %Integer) As %SQLQuery(COMPILEMODE = "IMMEDIATE", CONTAINID = 1, ROWSPEC = "TotalTime:%Integer", SELECTMODE = "RUNTIME") [ SqlName = TotalTimeByTaskUser, SqlProc ]
{
SELECT SUM({fn TIMESTAMPDIFF(SQL_TSI_SECOND, StartTracking, EndTracking)}) as TotalTime FROM diashenrique_npm_Data.TimeTracking WHERE (TaskId = :pTaskId) AND (UserId = :pUserId) GROUP BY TaskId
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
<Value>UserId</Value>
</Value>
<Value name="4">
<Value>StartTracking</Value>
</Value>
<Value name="5">
<Value>EndTracking</Value>
</Value>
<Value name="6">
<Value>TotalTime</Value>
</Value>
<Value name="7">
<Value>LogWork</Value>
</Value>
</Data>
<DataLocation>^diashenrique4900.TimeTrackingD</DataLocation>
<DefaultData>TimeTrackingDefaultData</DefaultData>
<IdLocation>^diashenrique4900.TimeTrackingD</IdLocation>
<IndexLocation>^diashenrique4900.TimeTrackingI</IndexLocation>
<StreamLocation>^diashenrique4900.TimeTrackingS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
